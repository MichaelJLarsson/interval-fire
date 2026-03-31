import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useWorkoutStore, Phase } from '@/store/workoutStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useTimer } from '@/hooks/useTimer';
import { useChromeVisibility } from '@/hooks/useChromeVisibility';
import TimerRing, { PHASE_COLORS, CIRCUMFERENCE } from '@/components/timer/TimerRing';
import ChromeOverlay from '@/components/timer/ChromeOverlay';
import FlashOverlay from '@/components/shared/FlashOverlay';
import { Preset } from '@/constants/presets';
import { Colors } from '@/constants/theme';

export default function TimerScreen() {
  const router = useRouter();
  const { active, pause, resume, stop } = useWorkoutStore();
  const { audioEnabled, voiceEnabled, setAudio, setVoice } = useSettingsStore();
  const { visible: chromeVisible, show: showChrome, resetTimer: resetChromeTimer } = useChromeVisibility();

  // Track phase changes for flash
  const lastPhaseRef = useRef<Phase | 'finish' | null>(null);
  const [flashPhase, setFlashPhase] = React.useState<Phase | 'finish' | null>(null);

  useEffect(() => {
    activateKeepAwakeAsync();
    return () => { deactivateKeepAwake(); };
  }, []);

  // Fire flash when phase changes
  useEffect(() => {
    if (!active) return;
    if (active.phase !== lastPhaseRef.current) {
      lastPhaseRef.current = active.phase;
      setFlashPhase(active.phase);
      setTimeout(() => setFlashPhase(null), 700);
    }
  }, [active?.phase]);

  const handleComplete = (preset: Preset, elapsedSecs: number) => {
    setFlashPhase('finish');
    setTimeout(() => {
      router.replace({ pathname: '/complete', params: {
        name: preset.name,
        elapsedSecs: String(elapsedSecs),
        rounds: String(active?.round ?? preset.rounds),
      }});
    }, 650);
  };

  useTimer(handleComplete);

  if (!active) return null;

  const { phase, round, secondsLeft, totalSecsInPhase, preset, isPaused } = active;
  const phaseColor = PHASE_COLORS[phase] ?? Colors.work;
  const progress = totalSecsInPhase > 0 ? secondsLeft / totalSecsInPhase : 0;
  const isPulsing = phase === 'work' && !isPaused;

  // Format countdown
  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  const countdownText = `${mm}:${String(ss).padStart(2, '0')}`;

  // Build dots
  const dots = Array.from({ length: preset.rounds }, (_, i) => ({
    done:    i < round - 1,
    current: i === round - 1 && phase !== 'prep',
  }));

  const phaseLabel = phase === 'prep' ? 'GET READY' : phase === 'work' ? 'WORK' : 'REST';
  const roundLabel = phase === 'prep' ? 'Preparing…' : `Round ${round} of ${preset.rounds}`;

  const handleTap = () => showChrome();

  return (
    <Pressable style={styles.screen} onPress={handleTap}>
      {/* Always-visible core */}
      <View style={styles.core} pointerEvents="none">
        <TimerRing progress={progress} color={phaseColor} isPulsing={isPulsing} />
        {/* Countdown text is a sibling to the ring, not inside it */}
        <View style={styles.countdown}>
          <Text style={[styles.countdownNum, { color: phaseColor }]}>{countdownText}</Text>
          <Text style={styles.countdownLbl}>{phaseLabel}</Text>
        </View>
      </View>

      <Text style={styles.nextText}>
        {phase === 'prep'
          ? `Next: Work ${mm}:${String(preset.workSecs % 60).padStart(2,'0')}`
          : phase === 'work'
            ? round >= preset.rounds ? 'Last round!' : `Next: Rest ${Math.floor(preset.restSecs/60)}:${String(preset.restSecs%60).padStart(2,'0')}`
            : `Next: Work ${Math.floor(preset.workSecs/60)}:${String(preset.workSecs%60).padStart(2,'0')} · Round ${round + 1}`
        }
      </Text>

      {/* Chrome overlay */}
      <ChromeOverlay
        visible={chromeVisible}
        workoutName={preset.name}
        phaseBadge={phaseLabel}
        phaseColor={phaseColor}
        roundLabel={roundLabel}
        dots={dots}
        audioOn={audioEnabled}
        voiceOn={voiceEnabled}
        onToggleAudio={() => { setAudio(!audioEnabled); resetChromeTimer(); }}
        onToggleVoice={() => { setVoice(!voiceEnabled); resetChromeTimer(); }}
        onStop={() => { stop(); router.replace('/(tabs)/'); }}
        onPauseResume={() => { isPaused ? resume() : pause(); resetChromeTimer(); }}
        onSkip={() => { /* advance handled by store */ resetChromeTimer(); }}
        isPaused={isPaused}
      />

      {/* Phase change flash */}
      <FlashOverlay phase={flashPhase} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  core:   { alignItems: 'center', justifyContent: 'center' },
  countdown: {
    position: 'absolute',
    alignItems: 'center',
    // Sits on top of ring but is NOT inside pulsing element
  },
  countdownNum: { fontFamily: 'BarlowCondensed_900Black', fontSize: 82, lineHeight: 82, letterSpacing: -2 },
  countdownLbl: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, color: Colors.textMuted, marginTop: 4 },
  nextText: { marginTop: 14, fontSize: 12, color: '#999', fontWeight: '500' },
});
