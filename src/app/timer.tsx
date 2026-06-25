import React, { useEffect, useRef } from 'react'
import { Alert, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'

import { Defs, RadialGradient, Rect, Stop, Svg } from 'react-native-svg'

import FlashOverlay from '@/components/shared/FlashOverlay'
import ChromeOverlay from '@/components/timer/ChromeOverlay'
import TimerRing, { PHASE_COLORS } from '@/components/timer/TimerRing'
import { Preset } from '@/constants/presets'
import { Colors, FontSizes } from '@/constants/theme'
import { useChromeVisibility } from '@/hooks/useChromeVisibility'
import { useTimer } from '@/hooks/useTimer'
import { useSettingsStore } from '@/store/settingsStore'
import { Phase, useWorkoutStore } from '@/store/workoutStore'

export default function TimerScreen() {
  const router = useRouter()
  const { active, pause, resume, stop } = useWorkoutStore()
  const { audioEnabled, voiceEnabled, setAudio, setVoice } = useSettingsStore()
  const {
    visible: chromeVisible,
    show: showChrome,
    resetTimer: resetChromeTimer,
  } = useChromeVisibility()

  // Track phase changes for flash
  const lastPhaseRef = useRef<Phase | 'finish' | null>(null)
  const [flashPhase, setFlashPhase] = React.useState<Phase | 'finish' | null>(null)

  useEffect(() => {
    activateKeepAwakeAsync()
    return () => {
      deactivateKeepAwake()
    }
  }, [])

  // Fire flash when phase changes
  useEffect(() => {
    if (!active) return
    if (active.phase !== lastPhaseRef.current) {
      lastPhaseRef.current = active.phase
      setFlashPhase(active.phase)
      setTimeout(() => setFlashPhase(null), 700)
    }
  }, [active])

  const handleComplete = (preset: Preset, elapsedSecs: number) => {
    setFlashPhase('finish')
    setTimeout(() => {
      router.replace({
        pathname: '/complete',
        params: {
          name: preset.name,
          elapsedSecs: String(elapsedSecs),
          rounds: String(active?.round ?? preset.rounds),
        },
      })
    }, 650)
  }

  const { skip } = useTimer(handleComplete)
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()

  if (!active) return null

  const { phase, round, secondsLeft, totalSecsInPhase, preset, isPaused } = active
  const phaseColor = PHASE_COLORS[phase] ?? Colors.work
  const phaseGradientStart =
    phase === 'rest' ? '#003d2b' : phase === 'prep' ? '#3d2e00' : Colors.gradientStart
  const progress = totalSecsInPhase > 0 ? secondsLeft / totalSecsInPhase : 0
  const isPulsing = phase === 'work' && !isPaused

  // Format countdown
  const mm = Math.floor(secondsLeft / 60)
  const ss = secondsLeft % 60
  const countdownText = `${mm}:${String(ss).padStart(2, '0')}`

  // Build dots
  const dots = Array.from({ length: preset.rounds }, (_, i) => ({
    done: i < round - 1,
    current: i === round - 1 && phase !== 'prep',
  }))

  const phaseLabel = phase === 'prep' ? 'GET READY' : phase === 'work' ? 'WORK' : 'REST'
  const roundLabel = phase === 'prep' ? 'Preparing…' : `Round ${round} of ${preset.rounds}`

  const handleTap = () => showChrome()

  return (
    <LinearGradient
      colors={[phaseGradientStart, Colors.gradientEnd]}
      locations={[0, 0.22]}
      style={styles.gradient}
    >
      {/* Radial background gradient */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width={windowWidth} height={windowHeight}>
          <Defs>
            <RadialGradient
              id="cornerGlow"
              cx={windowWidth}
              cy={windowHeight / 1.25}
              r={windowWidth / 1.25}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor={phaseColor} stopOpacity={0.28} />
              <Stop offset="65%" stopColor={phaseColor} stopOpacity={0.1} />
              <Stop offset="100%" stopColor={phaseColor} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={windowWidth} height={windowHeight} fill="url(#cornerGlow)" />
        </Svg>
      </View>
      <Pressable style={styles.screen} onPress={handleTap}>
        {/* Always-visible core */}
        <View style={styles.core} pointerEvents="none">
          <TimerRing
            progress={progress}
            color={phaseColor}
            isPulsing={isPulsing}
            phase={phase}
            isPaused={isPaused}
            countdownText={countdownText}
            phaseLabel={phaseLabel}
          />
        </View>

        <Text style={styles.nextText}>
          {phase === 'prep'
            ? `Next: Work ${mm}:${String(preset.workSecs % 60).padStart(2, '0')}`
            : phase === 'work'
              ? round >= preset.rounds
                ? 'Last round!'
                : `Next: Rest ${Math.floor(preset.restSecs / 60)}:${String(preset.restSecs % 60).padStart(2, '0')}`
              : `Next: Work ${Math.floor(preset.workSecs / 60)}:${String(preset.workSecs % 60).padStart(2, '0')} · Round ${round + 1}`}
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
          onToggleAudio={() => {
            setAudio(!audioEnabled)
            resetChromeTimer()
          }}
          onToggleVoice={() => {
            setVoice(!voiceEnabled)
            resetChromeTimer()
          }}
          onStop={() => {
            if (!active) return
            const wasPaused = active.isPaused
            if (!wasPaused) pause()
            Alert.alert(
              'Stop workout?',
              'Your progress will be lost.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                  onPress: () => {
                    if (!wasPaused) resume()
                  },
                },
                {
                  text: 'Stop',
                  style: 'destructive',
                  onPress: () => {
                    stop()
                    router.replace('/')
                  },
                },
              ],
              {
                cancelable: true,
                onDismiss: () => {
                  if (!wasPaused) resume()
                },
              },
            )
          }}
          onPauseResume={() => {
            if (isPaused) {
              resume()
            } else {
              pause()
            }
            resetChromeTimer()
          }}
          onSkip={() => {
            skip()
            resetChromeTimer()
          }}
          isPaused={isPaused}
        />

        {/* Phase change flash */}
        <FlashOverlay phase={flashPhase} />
      </Pressable>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  core: { alignItems: 'center', justifyContent: 'center' },
  nextText: { marginTop: 26, fontSize: FontSizes.body, color: Colors.textLo, fontWeight: '600' },
})
