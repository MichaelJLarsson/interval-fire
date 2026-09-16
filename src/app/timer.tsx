import React, { useEffect, useRef } from 'react'
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'

import { Defs, RadialGradient, Rect, Stop, Svg } from 'react-native-svg'

import FlashOverlay from '@/components/shared/FlashOverlay'
import ChromeOverlay from '@/components/timer/ChromeOverlay'
import LandscapeControls from '@/components/timer/LandscapeControls'
import TimerRing, { PHASE_COLORS } from '@/components/timer/TimerRing'
import { Preset } from '@/constants/presets'
import { Colors, Fonts, FontSizes, Radii, Spacing } from '@/constants/theme'
import { useChromeVisibility } from '@/hooks/useChromeVisibility'
import { useLandscapeLayout } from '@/hooks/useLandscapeLayout'
import { useOrientationLock } from '@/hooks/useOrientationLock'
import { useTimer } from '@/hooks/useTimer'
import { useSettingsStore } from '@/store/settingsStore'
import { Phase, useWorkoutStore } from '@/store/workoutStore'

export default function TimerScreen() {
  const router = useRouter()
  useOrientationLock()
  const { active, pause, resume, stop } = useWorkoutStore()
  const { audioEnabled, voiceEnabled, setAudio, setVoice } = useSettingsStore()
  const {
    visible: chromeVisible,
    show: showChrome,
    resetTimer: resetChromeTimer,
  } = useChromeVisibility()

  const [stopConfirmVisible, setStopConfirmVisible] = React.useState(false)
  const stopWasPausedRef = useRef(false)

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

  const handleComplete = (preset: Preset, elapsedSecs: number, roundsCompleted: number) => {
    setFlashPhase('finish')
    freezeLandscape()
    setTimeout(() => {
      router.replace({
        pathname: '/complete',
        params: {
          name: preset.name,
          elapsedSecs: String(elapsedSecs),
          rounds: String(roundsCompleted),
        },
      })
    }, 650)
  }

  const { skip } = useTimer(handleComplete)
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const { isLandscape, freezeLandscape } = useLandscapeLayout()

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

  let nextText: string
  switch (phase) {
    case 'prep':
      nextText = `Next: Work ${mm}:${String(preset.workSecs % 60).padStart(2, '0')}`
      break
    case 'work':
      nextText =
        round >= preset.rounds
          ? 'Last round!'
          : `Next: Rest ${Math.floor(preset.restSecs / 60)}:${String(preset.restSecs % 60).padStart(2, '0')}`
      break
    default:
      nextText = `Next: Work ${Math.floor(preset.workSecs / 60)}:${String(preset.workSecs % 60).padStart(2, '0')} · Round ${round + 1}`
  }

  const handleTap = () => showChrome()

  const handleStop = () => {
    if (!active) return
    stopWasPausedRef.current = active.isPaused
    if (!active.isPaused) pause()
    setStopConfirmVisible(true)
  }

  const handleStopConfirm = () => {
    setStopConfirmVisible(false)
    freezeLandscape()
    router.replace('/')
    // Delay stop() so active stays non-null while the navigation fade captures the outgoing frame.
    setTimeout(() => stop(), 400)
  }

  const handleStopCancel = () => {
    setStopConfirmVisible(false)
    if (!stopWasPausedRef.current) resume()
  }

  const handlePauseResume = () => {
    if (isPaused) {
      resume()
    } else {
      pause()
    }
  }

  const handleSkip = () => skip()

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
        {isLandscape ? (
          <View style={styles.landscapeRow}>
            <View style={styles.landscapeRingHalf}>
              <Text style={[styles.landscapePhaseLabel, { color: phaseColor }]}>{phaseLabel}</Text>
              <View style={styles.landscapeRingBox}>
                <TimerRing
                  progress={progress}
                  color={phaseColor}
                  isPulsing={isPulsing}
                  phase={phase}
                  isPaused={isPaused}
                  countdownText={countdownText}
                  phaseLabel={phaseLabel}
                  showPhaseLabel={false}
                  size={320}
                />
                <Text style={styles.landscapeNextText}>{nextText}</Text>
              </View>
            </View>

            <LandscapeControls
              workoutName={preset.name}
              phaseBadge={phaseLabel}
              phaseColor={phaseColor}
              roundLabel={roundLabel}
              dots={dots}
              audioOn={audioEnabled}
              voiceOn={voiceEnabled}
              onToggleAudio={() => setAudio(!audioEnabled)}
              onToggleVoice={() => setVoice(!voiceEnabled)}
              onStop={handleStop}
              onPauseResume={handlePauseResume}
              onSkip={handleSkip}
              isPaused={isPaused}
            />
          </View>
        ) : (
          <>
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

            <Text style={styles.nextText}>{nextText}</Text>

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
              onStop={handleStop}
              onPauseResume={() => {
                handlePauseResume()
                resetChromeTimer()
              }}
              onSkip={() => {
                handleSkip()
                resetChromeTimer()
              }}
              isPaused={isPaused}
            />
          </>
        )}

        {/* Phase change flash */}
        <FlashOverlay phase={flashPhase} />
      </Pressable>

      {stopConfirmVisible && (
        <Pressable style={styles.confirmBackdrop} onPress={handleStopCancel}>
          <View style={styles.confirmCard} onStartShouldSetResponder={() => true}>
            <Text style={styles.confirmTitle}>Stop workout?</Text>
            <Text style={styles.confirmMessage}>Your progress will be lost.</Text>
            <View style={styles.confirmButtons}>
              <Pressable style={styles.confirmCancelButton} onPress={handleStopCancel}>
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.confirmStopButton} onPress={handleStopConfirm}>
                <Text style={styles.confirmStopText}>Stop</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      )}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  core: { alignItems: 'center', justifyContent: 'center' },
  nextText: { marginTop: 26, fontSize: FontSizes.body, color: Colors.textLo, fontWeight: '600' },
  landscapeRow: { flex: 1, flexDirection: 'row', alignSelf: 'stretch' },
  landscapeRingHalf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.screenH,
  },
  landscapeRingBox: { width: 320, height: 320 },
  landscapePhaseLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSizes.caption,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  landscapeNextText: {
    position: 'absolute',
    top: 216,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: FontSizes.body,
    color: Colors.textLo,
    fontWeight: '600',
  },
  confirmBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    width: 280,
    gap: Spacing.md,
  },
  confirmTitle: {
    fontFamily: Fonts.condensed,
    fontSize: FontSizes.headingMd,
    color: Colors.textHi,
    textAlign: 'center',
  },
  confirmMessage: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    color: Colors.textLo,
    textAlign: 'center',
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  confirmCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.pill,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  confirmCancelText: {
    color: Colors.textMid,
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSizes.body,
  },
  confirmStopButton: {
    flex: 1,
    backgroundColor: Colors.work,
    borderRadius: Radii.pill,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  confirmStopText: {
    color: Colors.textHi,
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSizes.body,
  },
})
