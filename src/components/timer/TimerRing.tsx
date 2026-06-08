import { Colors, Fonts, FontSizes } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, G, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

const SIZE = 270;
const RADIUS = 120;
const STROKE = 9;
const DOT_RADIUS = 11;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;
const ARC_SEGMENTS = 120;
const CLIP_R = RADIUS + STROKE + 2;
const SEGMENT_ANGLE = (2 * Math.PI) / ARC_SEGMENTS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath   = Animated.createAnimatedComponent(Path);

export const PHASE_COLORS = {
  work: Colors.work,
  rest: Colors.rest,
  prep: Colors.prep,
} as const;

// [gradStart (12 o'clock, arc beginning), gradEnd (arc tip at full progress)]
const PHASE_GRADIENT: Record<string, [string, string]> = {
  work: [Colors.workAlt, Colors.work],
  rest: [Colors.restAlt, Colors.rest],
  prep: [Colors.prep,    Colors.prep],
};

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerpColor(a: string, b: string, t: number): string {
  const [r1, g1, b1] = parseHex(a);
  const [r2, g2, b2] = parseHex(b);
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
}

// Arc segment paths are geometry-only, computed once at module load
const SEGMENT_PATHS = Array.from({ length: ARC_SEGMENTS }, (_, i) => {
  const start = -Math.PI / 2 + i * SEGMENT_ANGLE;
  const end   = start + SEGMENT_ANGLE + 0.01; // tiny overlap prevents anti-aliasing seams
  const x1 = CENTER + RADIUS * Math.cos(start);
  const y1 = CENTER + RADIUS * Math.sin(start);
  const x2 = CENTER + RADIUS * Math.cos(end);
  const y2 = CENTER + RADIUS * Math.sin(end);
  return `M ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2}`;
});

// Pie-sector clip path from 12 o'clock clockwise by `angle` radians
function sectorPath(angle: number): string {
  'worklet';
  if (angle <= 0) return `M ${CENTER} ${CENTER}`;
  const capped = angle >= 2 * Math.PI - 0.001 ? 2 * Math.PI - 0.001 : angle;
  const sa = -Math.PI / 2;
  const ea = sa + capped;
  const large = capped > Math.PI ? 1 : 0;
  const x1 = CENTER + CLIP_R * Math.cos(sa);
  const y1 = CENTER + CLIP_R * Math.sin(sa);
  const x2 = CENTER + CLIP_R * Math.cos(ea);
  const y2 = CENTER + CLIP_R * Math.sin(ea);
  return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${CLIP_R} ${CLIP_R} 0 ${large} 1 ${x2} ${y2} Z`;
}

interface Props {
  progress: number;
  color: string;
  isPulsing: boolean;
  phase: string;
  isPaused: boolean;
  countdownText: string;
  phaseLabel: string;
}

const offsetFor = (progress: number) =>
  CIRCUMFERENCE * (1 - Math.max(0, Math.min(1, progress)));

export default function TimerRing({ progress, color, isPulsing, phase, isPaused, countdownText, phaseLabel }: Props) {
  const scale     = useSharedValue(1);
  const dashOffset = useSharedValue(offsetFor(progress));
  const lastPhase  = useRef(phase);

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
  }, [isPulsing, scale]);

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
  }, [progress, phase, isPaused, dashOffset]);

  const svgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Animated clip path reveals the gradient arc up to the current progress angle
  const clipProps = useAnimatedProps(() => {
    const p = 1 - dashOffset.value / CIRCUMFERENCE;
    return { d: sectorPath(p * 2 * Math.PI) };
  });

  // Dot at the arc tip, derived from the same dashOffset
  const dotAngle = useDerivedValue(() => {
    const p = 1 - dashOffset.value / CIRCUMFERENCE;
    return p * 2 * Math.PI - Math.PI / 2;
  });
  const dotCx = useDerivedValue(() => CENTER + RADIUS * Math.cos(dotAngle.value));
  const dotCy = useDerivedValue(() => CENTER + RADIUS * Math.sin(dotAngle.value));

  const dotCoreProps = useAnimatedProps(() => ({ cx: dotCx.value, cy: dotCy.value }));
  const dotRing1Props = useAnimatedProps(() => ({ cx: dotCx.value, cy: dotCy.value }));
  const dotRing2Props = useAnimatedProps(() => ({ cx: dotCx.value, cy: dotCy.value }));

  const [gradStart, gradEnd] = PHASE_GRADIENT[phase] ?? [color, color];

  // Angular gradient: each segment has the color fixed at its angle around the ring
  const segmentColors = Array.from({ length: ARC_SEGMENTS }, (_, i) =>
    lerpColor(gradStart, gradEnd, i / (ARC_SEGMENTS - 1))
  );
  // Dot color matches the angular gradient at the tip's current angular position
  const dotColor = lerpColor(gradStart, gradEnd, progress);

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.svgWrap, svgStyle]}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Defs>
            <ClipPath id="progressClip">
              <AnimatedPath animatedProps={clipProps} />
            </ClipPath>
          </Defs>

          {/* Track ring */}
          <Circle cx={CENTER} cy={CENTER} r={RADIUS}
            fill="none" stroke="#3a3a3a" strokeWidth={STROKE} />

          {/* Angular gradient arc, revealed by animated clip sector */}
          <G clipPath="url(#progressClip)">
            {segmentColors.map((segColor, i) => (
              <Path key={i} d={SEGMENT_PATHS[i]}
                stroke={segColor} strokeWidth={STROKE}
                fill="none" strokeLinecap="butt" />
            ))}
          </G>

          {/* Glow halo (outer) */}
          <AnimatedCircle animatedProps={dotRing2Props} r={26} fill={dotColor} opacity={0.10} />
          {/* Glow halo (inner) */}
          <AnimatedCircle animatedProps={dotRing1Props} r={16} fill={dotColor} opacity={0.28} />
          {/* Solid dot at arc tip */}
          <AnimatedCircle animatedProps={dotCoreProps} r={DOT_RADIUS} fill={dotColor} />
        </Svg>
      </Animated.View>

      {/* Non-pulsing text layer — never scales */}
      <Svg style={StyleSheet.absoluteFill} width={SIZE} height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`} pointerEvents="none">
        <Defs>
          <LinearGradient id="timerTextGrad"
            x1={CENTER} y1={CENTER - 55} x2={CENTER} y2={CENTER + 25}
            gradientUnits="userSpaceOnUse">
            <Stop offset="0%"   stopColor={gradStart} />
            <Stop offset="65%" stopColor={gradEnd}   />
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
  );
}

const styles = StyleSheet.create({
  container: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  svgWrap:   { alignItems: 'center', justifyContent: 'center' },
});
