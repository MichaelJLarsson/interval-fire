import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { PRESETS, Preset } from '@/constants/presets';
import { useWorkoutStore } from '@/store/workoutStore';
import { useHistoryStore, computeStreak } from '@/store/historyStore';
import PresetCarousel from '@/components/home/PresetCarousel';

export default function HomeScreen() {
  const router = useRouter();
  const { startWorkout } = useWorkoutStore();
  const { records } = useHistoryStore();
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);

  const streak = computeStreak(records);

  const handleStart = () => {
    startWorkout(selectedPreset);
    router.push('/timer');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[]} // nothing sticky
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>INTERVAL{'\n'}<Text style={styles.titleAccent}>FIRE</Text><Text style={styles.flame}> 🔥</Text></Text>
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>{streak}-day streak</Text>
            </View>
          )}
        </View>

        {/* Quick start */}
        <Text style={styles.sectionLabel}>Quick start</Text>
        <PresetCarousel
          presets={PRESETS}
          selectedId={selectedPreset.id}
          onSelect={setSelectedPreset}
        />

        {/* Start CTA */}
        <View style={styles.ctaWrap}>
          <Pressable style={styles.cta} onPress={handleStart}>
            <Text style={styles.ctaText}>▶  Start workout</Text>
          </Pressable>
        </View>

        {/* Recent */}
        <Text style={[styles.sectionLabel, { marginTop: 0 }]}>Recent</Text>
        {records.length === 0 ? (
          <Text style={styles.empty}>No workouts yet — start your first one above!</Text>
        ) : (
          records.slice(0, 8).map((r) => (
            <View key={r.id} style={styles.recentRow}>
              <View style={styles.recentInfo}>
                <Text style={styles.recentName}>{r.name}</Text>
                <Text style={styles.recentMeta}>
                  {new Date(r.completedAt).toLocaleDateString()} · {Math.round(r.durationSecs / 60)}:00 min · {r.type}
                </Text>
              </View>
              <View>
                <Text style={styles.kcal}>{r.kcalBurned}</Text>
                <Text style={styles.kcalUnit}>kcal</Text>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.screenH, paddingTop: 40, paddingBottom: 24 },
  title:  { fontFamily: 'BarlowCondensed_900Black', fontSize: 36, textTransform: 'uppercase', lineHeight: 34, color: Colors.textHi },
  titleAccent: { color: Colors.work },
  flame:  { fontSize: 28 },
  streakBadge: { backgroundColor: '#ff3d3d22', borderWidth: 1, borderColor: '#ff3d3d55', paddingHorizontal: 11, paddingVertical: 6, borderRadius: Radii.full },
  streakText:  { color: '#ff6a6a', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

  sectionLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, color: Colors.textMuted, paddingHorizontal: Spacing.screenH, marginBottom: 12, marginTop: 0 },

  ctaWrap: { paddingHorizontal: Spacing.screenH, paddingBottom: 28, paddingTop: 14 },
  cta:     { backgroundColor: Colors.work, borderRadius: Radii.lg, paddingVertical: 18, alignItems: 'center' },
  ctaText: { fontFamily: 'BarlowCondensed_900Black', fontSize: 22, color: Colors.white, textTransform: 'uppercase', letterSpacing: 0.5 },

  recentRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.screenH, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  recentInfo: { flex: 1 },
  recentName: { fontSize: 13, fontWeight: '600', color: Colors.textMid },
  recentMeta: { fontSize: 11, color: '#777', marginTop: 1 },
  kcal:       { fontFamily: 'BarlowCondensed_700Bold', fontSize: 19, color: '#ff5555', textAlign: 'right' },
  kcalUnit:   { fontSize: 10, color: '#777', textAlign: 'right' },
  empty:      { paddingHorizontal: Spacing.screenH, color: Colors.textMuted, fontSize: 13 },
});
