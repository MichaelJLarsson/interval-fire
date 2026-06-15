import FastForwardFilledIcon from '@/components/shared/icons/FastForwardFilledIcon'
import PauseIcon from '@/components/shared/icons/PauseIcon'
import { Colors, Fonts, FontSizes, Spacing } from '@/constants/theme'
import React, { useEffect } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const SWITCH_TRACK_OFF = '#2c2c2c'
const SWITCH_THUMB_OFF = '#555'
const SWITCH_THUMB_TRAVEL = 15 // track 32 - padding 4 - thumb 13

function AnimatedSwitch({ on }: { on: boolean }) {
  const v = useSharedValue(on ? 1 : 0)
  useEffect(() => {
    v.value = withTiming(on ? 1 : 0, { duration: 220, easing: Easing.out(Easing.cubic) })
  }, [on, v])

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(v.value, [0, 1], [SWITCH_TRACK_OFF, Colors.work]),
  }))
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: v.value * SWITCH_THUMB_TRAVEL }],
    backgroundColor: interpolateColor(v.value, [0, 1], [SWITCH_THUMB_OFF, Colors.white]),
  }))

  return (
    <Animated.View style={[styles.sw, trackStyle]}>
      <Animated.View style={[styles.thumb, thumbStyle]} />
    </Animated.View>
  )
}

interface Props {
  visible: boolean
  workoutName: string
  phaseBadge: string
  phaseColor: string
  roundLabel: string
  dots: { done: boolean; current: boolean }[]
  audioOn: boolean
  voiceOn: boolean
  onToggleAudio: () => void
  onToggleVoice: () => void
  onStop: () => void
  onPauseResume: () => void
  onSkip: () => void
  isPaused: boolean
}

const SPRING = { duration: 420, easing: Easing.out(Easing.back(1.15)) } as const
const FADE = { duration: 350 } as const

export default function ChromeOverlay({
  visible,
  workoutName,
  phaseBadge,
  phaseColor,
  roundLabel,
  dots,
  audioOn,
  voiceOn,
  onToggleAudio,
  onToggleVoice,
  onStop,
  onPauseResume,
  onSkip,
  isPaused,
}: Props) {
  // Header slides down from top
  const headStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(visible ? 0 : -90, SPRING) }],
    opacity: withTiming(visible ? 1 : 0, FADE),
  }))

  // Dots + round slide down, slight delay
  const midStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(visible ? 0 : -60, SPRING) }],
    opacity: withTiming(visible ? 1 : 0, { duration: 300 }),
  }))

  // Controls slide up from bottom
  const footStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(visible ? 0 : 140, SPRING) }],
    opacity: withTiming(visible ? 1 : 0, FADE),
  }))

  // Toggles slide up slightly after controls
  const togStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(visible ? 0 : 140, SPRING) }],
    opacity: withTiming(visible ? 1 : 0, { duration: 350, easing: Easing.out(Easing.ease) }),
  }))

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* ── Header ── */}
      <Animated.View style={[styles.head, headStyle]} pointerEvents={visible ? 'auto' : 'none'}>
        <View style={styles.headLeft}>
          <Text style={styles.workoutName}>{workoutName}</Text>
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: phaseColor + '21', borderColor: phaseColor + '54' },
          ]}
        >
          <Text style={[styles.badgeText, { color: phaseColor }]}>{phaseBadge}</Text>
        </View>
      </Animated.View>

      {/* ── Progress dots + round label ── */}
      <Animated.View style={[styles.mid, midStyle]} pointerEvents="none">
        <View style={styles.dots}>
          {dots.map((d, i) => (
            <View
              key={i}
              style={[styles.dot, d.done && styles.dotDone, d.current && styles.dotCurrent]}
            />
          ))}
        </View>
        <Text style={styles.roundLabel}>{roundLabel}</Text>
      </Animated.View>

      {/* ── Controls ── */}
      <Animated.View style={[styles.foot, footStyle]} pointerEvents={visible ? 'auto' : 'none'}>
        <View style={styles.controls}>
          <Pressable style={styles.btnSm} onPress={onStop}>
            <View style={styles.stopIcon} />
          </Pressable>
          <Pressable style={[styles.btnLg, isPaused && styles.btnLgPaused]} onPress={onPauseResume}>
            {isPaused ? (
              <Text style={styles.btnLgIcon}>▶</Text>
            ) : (
              <PauseIcon color={Colors.white} size={28} />
            )}
          </Pressable>
          <Pressable style={styles.btnSm} onPress={onSkip}>
            <FastForwardFilledIcon color={Colors.textHi} size={22} />
          </Pressable>
        </View>
      </Animated.View>

      {/* ── Audio toggles ── */}
      <Animated.View style={[styles.toggles, togStyle]} pointerEvents={visible ? 'auto' : 'none'}>
        <Pressable style={styles.toggle} onPress={onToggleAudio}>
          <AnimatedSwitch on={audioOn} />
          <Text style={styles.toggleLabel}>Audio</Text>
        </Pressable>
        <Pressable style={styles.toggle} onPress={onToggleVoice}>
          <AnimatedSwitch on={voiceOn} />
          <Text style={styles.toggleLabel}>Voice</Text>
        </Pressable>
      </Animated.View>

      {/* ── Ghost hint pill (always visible) ── */}
      {!visible && (
        <View style={styles.hint}>
          <View style={styles.hintPill} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  head: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 52,
    paddingHorizontal: Spacing.screenH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  workoutName: {
    fontFamily: Fonts.condensed,
    fontSize: FontSizes.headingMd,
    color: Colors.textHi,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  badgeText: {
    fontSize: FontSizes.label,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  mid: {
    position: 'absolute',
    top: 94,
    left: 0,
    right: 0,
  },
  dots: { flexDirection: 'row', gap: 3, paddingHorizontal: Spacing.screenH },
  dot: { flex: 1, height: 3, borderRadius: 2, backgroundColor: Colors.progressPending },
  dotDone: { backgroundColor: Colors.progressDone },
  dotCurrent: { backgroundColor: Colors.progressActive },
  roundLabel: {
    textAlign: 'center',
    fontSize: FontSizes.label,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Colors.textLo,
    marginTop: 12,
  },

  foot: {
    position: 'absolute',
    bottom: 52,
    left: 0,
    right: 0,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 23,
    paddingHorizontal: Spacing.screenH,
    paddingVertical: 16,
  },
  btnSm: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.planeBlack,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopIcon: { width: 12, height: 12, backgroundColor: '#d9d9d9' },
  btnLg: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.work,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLgPaused: { backgroundColor: '#555' },
  btnLgIcon: { color: Colors.white, fontSize: 22 },

  toggles: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
    paddingBottom: 20,
    paddingTop: 8,
  },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sw: { width: 32, height: 18, borderRadius: 9, justifyContent: 'center', paddingHorizontal: 2 },
  thumb: { width: 13, height: 13, borderRadius: 7 },
  toggleLabel: {
    fontSize: FontSizes.label,
    fontWeight: '700',
    color: Colors.textLo,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  hint: { position: 'absolute', bottom: 14, left: 0, right: 0, alignItems: 'center' },
  hintPill: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.13)' },
})
