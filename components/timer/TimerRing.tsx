import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, Easing,
} from 'react-native-reanimated';

const SIZE = 250;
const RADIUS = 110;
const STROKE = 9;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

export const PHASE_COLORS = {
  work: '#ff3d3d',
  rest: '#00e5a0',
  prep: '#ffc300',
} as const;

interface Props {
  progress: number;
  color: string;
  isPulsing: boolean;
}

export default function TimerRing({ progress, color, isPulsing }: Props) {
  const scale = useSharedValue(1);

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

  const svgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dashOffset = CIRCUMFERENCE * (1 - Math.max(0, Math.min(1, progress)));

  return (
    <View style={styles.container}>
      {/* SVG pulses; countdown text is a sibling — not inside this element */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.svgWrap, svgStyle]}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Circle cx={CENTER} cy={CENTER} r={RADIUS}
            fill="none" stroke="#222" strokeWidth={STROKE} />
          <Circle cx={CENTER} cy={CENTER} r={RADIUS}
            fill="none" stroke={color} strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
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
