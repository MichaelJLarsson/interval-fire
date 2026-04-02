import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withDelay, withTiming, withSpring,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { useHistoryStore, computeStreak } from '@/store/historyStore';

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
    <SafeAreaView style={styles.safe}>
      <View style={styles.inner}>
        {/* Checkmark */}
        <Animated.View style={[styles.checkWrap, checkStyle]}>
          <Svg width={90} height={90} viewBox="0 0 90 90">
            <Circle cx={45} cy={45} r={42} fill="#00e5a018" stroke={Colors.rest} strokeWidth={2.5} />
            <Path d="M26 45 L39 58 L64 32" fill="none" stroke={Colors.rest} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Animated.View>

        <Animated.View style={[styles.content, contentStyle]}>
          <Text style={styles.headline}>Workout{'\n'}Complete!</Text>
          <Text style={styles.workoutName}>{(name ?? '').toUpperCase()}</Text>

          {/* Stat tiles */}
          <View style={styles.tiles}>
            <View style={styles.tile}>
              <Text style={[styles.tileVal, { color: Colors.rest }]}>{durationLabel}</Text>
              <Text style={styles.tileLbl}>Duration</Text>
            </View>
            <View style={styles.tile}>
              <Text style={[styles.tileVal, { color: Colors.textHi }]}>{rounds ?? 0}</Text>
              <Text style={styles.tileLbl}>Rounds</Text>
            </View>
            <View style={styles.tile}>
              <Text style={[styles.tileVal, { color: '#ff5050' }]}>{kcal}</Text>
              <Text style={styles.tileLbl}>Kcal</Text>
            </View>
          </View>

          {/* Streak nudge */}
          {streak > 0 && (
            <View style={styles.streakBanner}>
              <Text style={styles.streakText}>🔥 {streak}-day streak — keep it up!</Text>
            </View>
          )}

          <Pressable style={styles.btn} onPress={() => router.replace('/(tabs)/')}>
            <Text style={styles.btnText}>Back to home</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  inner:  { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.screenH + 6 },
  checkWrap: { marginBottom: 24 },
  content:   { alignItems: 'center', width: '100%' },
  headline:  { fontFamily: 'BarlowCondensed_900Black', fontSize: 38, textTransform: 'uppercase', color: Colors.textHi, textAlign: 'center', lineHeight: 38, marginBottom: 6 },
  workoutName: { fontSize: 13, color: Colors.textDim, fontWeight: '500', marginBottom: 32, textTransform: 'uppercase', letterSpacing: 1 },
  tiles:    { flexDirection: 'row', gap: 10, width: '100%', marginBottom: 32 },
  tile:     { flex: 1, backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: 14, alignItems: 'center' },
  tileVal:  { fontFamily: 'BarlowCondensed_900Black', fontSize: 28, lineHeight: 28 },
  tileLbl:  { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textDim, marginTop: 4 },
  streakBanner: { backgroundColor: '#ff3d3d18', borderWidth: 1, borderColor: '#ff3d3d33', borderRadius: Radii.md, padding: 12, alignItems: 'center', marginBottom: 32, width: '100%' },
  streakText:   { fontSize: 13, color: '#ff6a6a', fontWeight: '600' },
  btn:     { backgroundColor: Colors.textHi, borderRadius: Radii.lg, paddingVertical: 16, width: '100%', alignItems: 'center' },
  btnText: { fontFamily: 'BarlowCondensed_900Black', fontSize: 20, color: '#111', textTransform: 'uppercase', letterSpacing: 0.5 },
});
