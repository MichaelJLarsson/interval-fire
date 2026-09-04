import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle, Path } from 'react-native-svg'

import { ConfettiExplosion } from '@/components/complete/ConfettiExplosion'
import CTAButton from '@/components/shared/CTAButton'
import GradientScreen from '@/components/shared/GradientScreen'
import StreakBanner from '@/components/shared/StreakBanner'
import SummaryCard from '@/components/shared/SummaryCard'
import { Colors, Fonts, FontSizes, Spacing } from '@/constants/theme'
import { computeStreak, useHistoryStore } from '@/store/historyStore'

// Confetti configuration
const CONFETTI_COUNT = 60
const CONFETTI_SPEED = 2
const CONFETTI_DURATION = 2000 // ms

interface Explosion {
  id: number
}

export default function CompleteScreen() {
  const router = useRouter()
  const { name, elapsedSecs, rounds } = useLocalSearchParams<{
    name: string
    elapsedSecs: string
    rounds: string
  }>()
  const { records } = useHistoryStore()
  const streak = computeStreak(records)

  const elapsed = parseInt(elapsedSecs ?? '0', 10)
  const mm = Math.floor(elapsed / 60)
  const ss = elapsed % 60
  const durationLabel = `${mm}:${String(ss).padStart(2, '0')}`
  const kcal = records[0]?.kcalBurned ?? 0

  // Animations
  const checkScale = useSharedValue(0)
  const checkOpacity = useSharedValue(0)
  const contentOpacity = useSharedValue(0)

  const [explosions, setExplosions] = useState<Explosion[]>([])

  const triggerExplosion = useCallback(() => {
    const id = Date.now()
    setExplosions((prev) => [...prev, { id }])

    // Re-trigger the spring animation for the checkmark
    checkScale.value = 0.8
    checkScale.value = withSpring(1, { damping: 10, stiffness: 200 })

    // Cleanup explosion after it finishes
    setTimeout(() => {
      setExplosions((prev) => prev.filter((exp) => exp.id !== id))
    }, CONFETTI_DURATION + 500) // Buffer for delays
  }, [checkScale])

  useEffect(() => {
    checkScale.value = withSpring(1, { damping: 10, stiffness: 200 })
    checkOpacity.value = withTiming(1, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(triggerExplosion)()
      }
    })
    contentOpacity.value = withDelay(350, withTiming(1, { duration: 400 }))
  }, [checkOpacity, checkScale, contentOpacity, triggerExplosion])

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }))
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }))

  return (
    <GradientScreen style={styles.inner}>
      {/* Checkmark */}
      <View style={styles.checkContainer}>
        <Pressable
          onPress={triggerExplosion}
          style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.92 : 1 }] }]}
        >
          <Animated.View style={[styles.checkWrap, checkStyle]}>
            <Svg width={90} height={90} viewBox="0 0 90 90">
              <Circle
                cx={45}
                cy={45}
                r={42}
                fill={Colors.restCheckBg}
                stroke={Colors.rest}
                strokeWidth={2.5}
              />
              <Path
                d="M26 45 L39 58 L64 32"
                fill="none"
                stroke={Colors.rest}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Animated.View>
        </Pressable>
        {explosions.map((exp) => (
          <ConfettiExplosion
            key={exp.id}
            count={CONFETTI_COUNT}
            speed={CONFETTI_SPEED}
            duration={CONFETTI_DURATION}
          />
        ))}
      </View>

      <Animated.View style={[styles.content, contentStyle]}>
        <Text style={styles.headline}>Workout{'\n'}Complete!</Text>
        <Text style={styles.workoutName}>{(name ?? '').toUpperCase()}</Text>

        {/* Streak nudge */}
        {streak > 0 && <StreakBanner streak={streak} style={styles.streakBanner} />}

        {/* Stat tiles */}
        <View style={styles.tiles}>
          <SummaryCard
            label="Duration"
            value={durationLabel}
            variant="eucalyptus"
            style={styles.tile}
          />
          <SummaryCard
            label="Rounds"
            value={String(rounds ?? 0)}
            variant="white"
            style={styles.tile}
          />
          <SummaryCard label="Kcal" value={String(kcal)} style={styles.tile} />
        </View>

        {/* Action buttons */}
        <View style={styles.ctaRow}>
          <CTAButton
            label="Stats"
            variant="outline"
            onPress={() => router.replace('/stats')}
            style={styles.ctaHalf}
          />
          <CTAButton label="Home" onPress={() => router.replace('/')} style={styles.ctaHalf} />
        </View>
      </Animated.View>
    </GradientScreen>
  )
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.screenH,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxl,
  },

  checkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 104,
  },

  checkWrap: {},

  content: { alignItems: 'center', width: '100%', flex: 1 },

  headline: {
    fontFamily: Fonts.condensed,
    fontSize: FontSizes.displayLg,
    textTransform: 'uppercase',
    color: Colors.textHi,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  workoutName: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textLo,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xxl,
  },

  streakBanner: {
    width: '100%',
    marginBottom: Spacing.xxl,
  },

  tiles: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  tile: { flex: 1 },

  ctaRow: {
    flexDirection: 'row',
    gap: 18,
    width: '100%',
    marginTop: 'auto',
  },
  ctaHalf: { flex: 1 },
})
