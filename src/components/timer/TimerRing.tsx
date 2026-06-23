import React, { useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'

import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg'

import { Colors, Fonts, FontSizes } from '@/constants/theme'

const SIZE = 270
const RADIUS = 120
const STROKE = 9
const DOT_RADIUS = 11
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const CENTER = SIZE / 2
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export const PHASE_COLORS = {
  work: Colors.work,
  rest: Colors.rest,
  prep: Colors.prep,
} as const

// [gradStart (12 o'clock, arc beginning), gradEnd (arc tip at full progress)]
const PHASE_GRADIENT: Record<string, [string, string]> = {
  work: [Colors.workAlt, Colors.work],
  rest: [Colors.restAlt, Colors.rest],
  prep: [Colors.prep, Colors.prep],
}

interface Props {
  progress: number
  color: string
  isPulsing: boolean
  phase: string
  isPaused: boolean
  countdownText: string
  phaseLabel: string
}

const offsetFor = (progress: number) => CIRCUMFERENCE * (1 - Math.max(0, Math.min(1, progress)))

export default function TimerRing({
  progress,
  color,
  isPulsing,
  phase,
  isPaused,
  countdownText,
  phaseLabel,
}: Props) {
  const scale = useSharedValue(1)
  const dashOffset = useSharedValue(offsetFor(progress))
  const lastPhase = useRef(phase)

  useEffect(() => {
    if (isPulsing) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.028, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      )
    } else {
      scale.value = withTiming(1, { duration: 200 })
    }
  }, [isPulsing, scale])

  useEffect(() => {
    const target = offsetFor(progress)
    if (lastPhase.current !== phase) {
      lastPhase.current = phase
      cancelAnimation(dashOffset)
      dashOffset.value = target
      return
    }
    if (isPaused) {
      cancelAnimation(dashOffset)
      return
    }
    dashOffset.value = withTiming(target, { duration: 1000, easing: Easing.linear })
  }, [progress, phase, isPaused, dashOffset])

  const svgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const arcProps = useAnimatedProps(() => ({ strokeDashoffset: dashOffset.value }))

  // Dot at the arc tip, derived from the same dashOffset
  const dotAngle = useDerivedValue(() => {
    const p = 1 - dashOffset.value / CIRCUMFERENCE
    return p * 2 * Math.PI - Math.PI / 2
  })
  const dotCx = useDerivedValue(() => CENTER + RADIUS * Math.cos(dotAngle.value))
  const dotCy = useDerivedValue(() => CENTER + RADIUS * Math.sin(dotAngle.value))

  const dotCoreProps = useAnimatedProps(() => ({ cx: dotCx.value, cy: dotCy.value }))
  const dotRing1Props = useAnimatedProps(() => ({ cx: dotCx.value, cy: dotCy.value }))
  const dotRing2Props = useAnimatedProps(() => ({ cx: dotCx.value, cy: dotCy.value }))

  const [gradStart, gradEnd] = PHASE_GRADIENT[phase] ?? [color, color]

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.svgWrap, svgStyle]}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {/* Track ring */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="#3a3a3a"
            strokeWidth={STROKE}
          />

          {/* Solid arc */}
          <AnimatedCircle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={arcProps}
            strokeLinecap="butt"
            transform={`rotate(-90, ${CENTER}, ${CENTER})`}
          />

          {/* Glow halo (outer) */}
          <AnimatedCircle animatedProps={dotRing2Props} r={26} fill={color} opacity={0.1} />
          {/* Glow halo (inner) */}
          <AnimatedCircle animatedProps={dotRing1Props} r={16} fill={color} opacity={0.28} />
          {/* Solid dot at arc tip */}
          <AnimatedCircle animatedProps={dotCoreProps} r={DOT_RADIUS} fill={color} />
        </Svg>
      </Animated.View>

      {/* Non-pulsing text layer — never scales */}
      <Svg
        style={StyleSheet.absoluteFill}
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient
            id="timerTextGrad"
            x1={CENTER}
            y1={CENTER - 55}
            x2={CENTER}
            y2={CENTER + 25}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={gradStart} />
            <Stop offset="65%" stopColor={gradEnd} />
          </LinearGradient>
        </Defs>

        <SvgText
          x={CENTER}
          y={149}
          textAnchor="middle"
          fontFamily={Fonts.condensed}
          fontSize={FontSizes.displayXL}
          fill="url(#timerTextGrad)"
          letterSpacing={-2}
        >
          {countdownText}
        </SvgText>

        <SvgText
          x={CENTER}
          y={188}
          textAnchor="middle"
          fontFamily={Fonts.bodySemiBold}
          fontSize={13}
          fill={Colors.textLo}
          letterSpacing={2}
        >
          {phaseLabel.toUpperCase()}
        </SvgText>
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  svgWrap: { alignItems: 'center', justifyContent: 'center' },
})
