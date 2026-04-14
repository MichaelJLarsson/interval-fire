import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withDelay, withTiming, withSpring,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Fonts, FontSizes, Spacing } from '@/constants/theme';
import { useHistoryStore, computeStreak } from '@/store/historyStore';
import GradientScreen from '@/components/shared/GradientScreen';
import SummaryCard from '@/components/shared/SummaryCard';
import StreakBanner from '@/components/shared/StreakBanner';
import CTAButton from '@/components/shared/CTAButton';

export default function CompleteScreen() {
  const router = useRouter();
  const { name, elapsedSecs, rounds } = useLocalSearchParams<{
    name: string; elapsedSecs: string; rounds: string;
  }>();
  const { records } = useHistoryStore();
  const streak = computeStreak(records);

  const elapsed = parseInt(elapsedSecs ?? '0', 10);
  const mm = Math.floor(elapsed / 60);
  const ss = elapsed % 60;
  const durationLabel = `${mm}:${String(ss).padStart(2, '0')}`;
  const kcal = records[0]?.kcalBurned ?? 0;

  // Animations
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    checkScale.value = withSpring(1, { damping: 10, stiffness: 200 });
    checkOpacity.value = withTiming(1, { duration: 300 });
    contentOpacity.value = withDelay(350, withTiming(1, { duration: 400 }));
  }, []);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));

  return (
    <GradientScreen style={styles.inner}>
        {/* Checkmark */}
        <Animated.View style={[styles.checkWrap, checkStyle]}>
          <Svg width={90} height={90} viewBox="0 0 90 90">
            <Circle cx={45} cy={45} r={42} fill={Colors.restCheckBg} stroke={Colors.rest} strokeWidth={2.5} />
            <Path d="M26 45 L39 58 L64 32" fill="none" stroke={Colors.rest} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Animated.View>

        <Animated.View style={[styles.content, contentStyle]}>
          <Text style={styles.headline}>Workout{'\n'}Complete!</Text>
          <Text style={styles.workoutName}>{(name ?? '').toUpperCase()}</Text>

          {/* Streak nudge */}
          {streak > 0 && (
            <StreakBanner streak={streak} style={styles.streakBanner} />
          )}

          {/* Stat tiles */}
          <View style={styles.tiles}>
            <SummaryCard label="Duration" value={durationLabel} variant="eucalyptus" style={styles.tile} />
            <SummaryCard label="Rounds" value={String(rounds ?? 0)} variant="white" style={styles.tile} />
            <SummaryCard label="Kcal" value={String(kcal)} style={styles.tile} />
          </View>

          {/* Action buttons */}
          <View style={styles.ctaRow}>
            <CTAButton label="Stats" variant="outline" onPress={() => router.replace('/stats')} style={styles.ctaHalf} />
            <CTAButton label="Home" onPress={() => router.replace('/')} style={styles.ctaHalf} />
          </View>
        </Animated.View>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.screenH },

  checkWrap: { marginBottom: 24 },

  content: { alignItems: 'center', width: '100%' },

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
    marginBottom: Spacing.xxl,
  },
  tile: { flex: 1 },

  ctaRow: {
    flexDirection: 'row',
    gap: 18,
    width: '100%',
  },
  ctaHalf: { flex: 1 },
});
