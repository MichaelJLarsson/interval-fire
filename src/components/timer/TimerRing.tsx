import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedStyle, useAnimatedProps,
  withRepeat, withSequence, withTiming, cancelAnimation, Easing,
} from 'react-native-reanimated';

const SIZE = 270;
const RADIUS = 120;
const STROKE = 9;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const PHASE_COLORS = {
  work: '#ff3d3d',
  rest: '#00e5a0',
  prep: '#ffc300',
} as const;

interface Props {
  progress: number;
  color: string;
  isPulsing: boolean;
  phase: string;
  isPaused: boolean;
}

const offsetFor = (progress: number) =>
  CIRCUMFERENCE * (1 - Math.max(0, Math.min(1, progress)));

export default function TimerRing({ progress, color, isPulsing, phase, isPaused }: Props) {
  const scale = useSharedValue(1);
  const dashOffset = useSharedValue(offsetFor(progress));
  const lastPhase = useRef(phase);

  useEffect(() => {
    if (isPulsing) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.028, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1,     { duration: 600, easing: Easing.inOut(Easing.ease) })
        ), -1, false
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [isPulsing]);

  useEffect(() => {
    const target = offsetFor(progress);
    if (lastPhase.current !== phase) {
      lastPhase.current = phase;
      cancelAnimation(dashOffset);
      dashOffset.value = target;
      return;
    }
    if (isPaused) {
      cancelAnimation(dashOffset);
      return;
    }
    dashOffset.value = withTiming(target, { duration: 1000, easing: Easing.linear });
  }, [progress, phase, isPaused]);

  const svgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  return (
    <View style={styles.container}>
      {/* SVG pulses; countdown text is a sibling — not inside this element */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.svgWrap, svgStyle]}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Circle cx={CENTER} cy={CENTER} r={RADIUS}
            fill="none" stroke="#3a3a3a" strokeWidth={STROKE} />
          <AnimatedCircle cx={CENTER} cy={CENTER} r={RADIUS}
            fill="none" stroke={color} strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={animatedProps}
            strokeLinecap="round"
            rotation="-90"
            origin={`${CENTER}, ${CENTER}`} />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  svgWrap:   { alignItems: 'center', justifyContent: 'center' },
});
