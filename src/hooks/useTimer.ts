import { useEffect, useRef, useCallback } from 'react';
import { useWorkoutStore, Phase } from '@/store/workoutStore';
import { useHistoryStore, estimateKcal } from '@/store/historyStore';
import { Preset } from '@/constants/presets';
import { useAudio } from './useAudio';
import { useHaptics } from './useHaptics';

// ─── Drift-corrected timer ────────────────────────────────────────────────────
// We record the expected next-tick timestamp and correct for JS drift each tick.

export function useTimer(onComplete: (preset: Preset, elapsedSecs: number) => void) {
  const { active, tick, setPhase, stop } = useWorkoutStore();
  const { addRecord } = useHistoryStore();
  const { playBeep, speak } = useAudio();
  const { phaseHaptic } = useHaptics();

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextTickRef = useRef<number>(0);

  const advancePhase = useCallback(() => {
    const { active } = useWorkoutStore.getState();
    if (!active) return;

    const { phase, round, preset } = active;

    if (phase === 'prep') {
      setPhase('work', preset.workSecs, preset.workSecs, 1);
      playBeep('high');
      speak('Work!');
      phaseHaptic('work');
    } else if (phase === 'work') {
      if (round >= preset.rounds) {
        const elapsedSecs = Math.round((Date.now() - active.startTimestamp) / 1000);
        const record = {
          id: String(Date.now()),
          name: preset.name,
          type: preset.type,
          completedAt: Date.now(),
          durationSecs: elapsedSecs,
          roundsCompleted: round,
          kcalBurned: estimateKcal(preset.workSecs, round),
        };
        addRecord(record);
        stop();
        playBeep('finish');
        speak('Workout complete! Great job!');
        onComplete(preset, elapsedSecs);
        return true;
      }
      setPhase('rest', preset.restSecs, preset.restSecs);
      playBeep('low');
      speak('Rest!');
      phaseHaptic('rest');
    } else {
      setPhase('work', preset.workSecs, preset.workSecs, round + 1);
      playBeep('high');
      speak('Work!');
      phaseHaptic('work');
    }
    return false;
  }, [setPhase, stop, playBeep, speak, phaseHaptic, addRecord, onComplete]);

  const advance = useCallback(() => {
    const { active } = useWorkoutStore.getState();
    if (!active || active.isPaused) return;

    if (active.secondsLeft > 0) {
      tick();
      scheduleTick();
      return;
    }

    const finished = advancePhase();
    if (finished) return;
    scheduleTick();
  }, [tick, advancePhase]);

  const scheduleTick = useCallback(() => {
    const now = Date.now();
    const delay = Math.max(0, nextTickRef.current - now + 1000);
    nextTickRef.current = now + delay;
    intervalRef.current = setTimeout(advance, delay);
  }, [advance]);

  const skip = useCallback(() => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    const finished = advancePhase();
    if (finished) return;
    const { active } = useWorkoutStore.getState();
    if (!active || active.isPaused) return;
    nextTickRef.current = Date.now() + 1000;
    intervalRef.current = setTimeout(advance, 1000);
  }, [advance, advancePhase]);

  // Start ticking when active changes from null → something
  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      return;
    }
    if (active.isPaused) {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      return;
    }
    // Fresh start
    nextTickRef.current = Date.now() + 1000;
    intervalRef.current = setTimeout(advance, 1000);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [active?.isPaused, !!active]);

  return { skip };
}
