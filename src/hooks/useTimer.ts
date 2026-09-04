import { useCallback, useEffect, useRef } from 'react'

import { Preset } from '@/constants/presets'
import { estimateKcal, useHistoryStore } from '@/store/historyStore'
import { useWorkoutStore } from '@/store/workoutStore'

import { useAudio, VoicePhrase } from './useAudio'
import { useHaptics } from './useHaptics'

// ─── Drift-corrected timer ────────────────────────────────────────────────────
// We record the expected next-tick timestamp and correct for JS drift each tick.

const COUNTDOWN_PHRASES: Record<number, VoicePhrase> = { 1: 'one', 2: 'two', 3: 'three' }

export function useTimer(
  onComplete: (preset: Preset, elapsedSecs: number, roundsCompleted: number) => void,
) {
  const { active, tick, setPhase, stop } = useWorkoutStore()
  const { addRecord } = useHistoryStore()
  const { playBeep, playTick, speak } = useAudio()
  const { phaseHaptic } = useHaptics()

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nextTickRef = useRef<number>(0)
  const announcedPrepRef = useRef<boolean>(false)
  const advanceRef = useRef<() => void>(() => {})

  const advancePhase = useCallback(() => {
    const { active } = useWorkoutStore.getState()
    if (!active) return

    const { phase, round, preset } = active

    if (phase === 'prep') {
      setPhase('work', preset.workSecs, preset.workSecs, 1)
      playBeep('high')
      speak(preset.rounds === 1 ? 'last_round' : 'work')
      phaseHaptic('work')
    } else if (phase === 'work') {
      if (round >= preset.rounds) {
        const elapsedSecs = Math.round((Date.now() - active.startTimestamp) / 1000)
        const record = {
          id: String(Date.now()),
          name: preset.name,
          type: preset.type,
          completedAt: Date.now(),
          durationSecs: elapsedSecs,
          roundsCompleted: round,
          kcalBurned: estimateKcal(
            preset.workSecs,
            round,
            preset.type,
            preset.warmupSecs,
            preset.cooldownSecs,
          ),
        }
        addRecord(record)
        stop()
        playBeep('finish')
        speak('complete')
        onComplete(preset, elapsedSecs, round)
        return true
      }
      setPhase('rest', preset.restSecs, preset.restSecs)
      playBeep('low')
      speak('rest')
      phaseHaptic('rest')
    } else {
      const nextRound = round + 1
      setPhase('work', preset.workSecs, preset.workSecs, nextRound)
      playBeep('high')
      speak(nextRound === preset.rounds ? 'last_round' : 'work')
      phaseHaptic('work')
    }
    return false
  }, [setPhase, stop, playBeep, speak, phaseHaptic, addRecord, onComplete])

  const scheduleTick = useCallback(() => {
    const now = Date.now()
    const delay = Math.max(0, nextTickRef.current - now + 1000)
    nextTickRef.current = now + delay
    intervalRef.current = setTimeout(() => advanceRef.current(), delay)
  }, [])

  const advance: () => void = useCallback((): void => {
    const { active } = useWorkoutStore.getState()
    if (!active || active.isPaused) return

    if (active.secondsLeft > 0) {
      tick()
      const updated = useWorkoutStore.getState().active
      if (updated) {
        const sLeft = updated.secondsLeft
        // Voice 3-2-1 during prep (gated by voiceEnabled);
        // four ticks (3, 2, 1, 0) during work/rest (gated by audioEnabled).
        if (updated.phase === 'prep') {
          if (sLeft >= 1 && sLeft <= 3) speak(COUNTDOWN_PHRASES[sLeft])
        } else if (sLeft >= 0 && sLeft <= 3) {
          playTick()
        }
      }
      scheduleTick()
      return
    }

    const finished = advancePhase()
    if (finished) return
    scheduleTick()
  }, [advancePhase, scheduleTick, tick, speak, playTick])

  advanceRef.current = advance

  const skip = useCallback(() => {
    if (intervalRef.current) clearTimeout(intervalRef.current)
    const finished = advancePhase()
    if (finished) return
    const { active } = useWorkoutStore.getState()
    if (!active || active.isPaused) return
    nextTickRef.current = Date.now() + 1000
    intervalRef.current = setTimeout(advance, 1000)
  }, [advance, advancePhase])

  // Start ticking when active changes from null → something
  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearTimeout(intervalRef.current)
      announcedPrepRef.current = false
      return
    }
    if (active.isPaused) {
      if (intervalRef.current) clearTimeout(intervalRef.current)
      return
    }
    // Announce prep phase only on the initial workout start — not on resume
    // or after a skip-while-paused (setPhase clears isPaused, which would
    // otherwise re-trigger this effect and double up with advancePhase's voice).
    if (!announcedPrepRef.current) {
      speak('prep')
      announcedPrepRef.current = true
    }
    // Fresh start
    nextTickRef.current = Date.now() + 1000
    intervalRef.current = setTimeout(advance, 1000)

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current)
    }
  }, [active, active?.isPaused, advance, speak])

  return { skip }
}
