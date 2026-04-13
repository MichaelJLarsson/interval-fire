import PresetCarousel from '@/components/home/PresetCarousel';
import FireIcon from '@/components/shared/FireIcon';
import CTAButton from '@/components/shared/CTAButton';
import GradientScreen from '@/components/shared/GradientScreen';
import SectionLabel from '@/components/shared/SectionLabel';
import StreakPill from '@/components/shared/StreakPill';
import HistoryRow from '@/components/shared/HistoryRow';
import { PRESETS, Preset } from '@/constants/presets';
import { Colors, Spacing } from '@/constants/theme';
import { computeStreak, useHistoryStore } from '@/store/historyStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { startWorkout } = useWorkoutStore();
  const { records } = useHistoryStore();
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);

  const streak = computeStreak(records);

  const handlePlay = (preset: Preset) => {
    startWorkout(preset);
    router.push('/timer');
  };

  const handleEdit = (preset: Preset) => {
    // Navigate to build screen (future: pre-fill with preset values)
    router.push('/build');
  };

  return (
    <GradientScreen>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <FireIcon size={64} color={Colors.work} strokeColor={Colors.bg} />
          {streak > 0 && (
            <StreakPill label={`${streak}-day streak`} />
          )}
        </View>

        {/* Quick start */}
        <SectionLabel style={styles.sectionLabel}>Quick start</SectionLabel>
        <PresetCarousel
          presets={PRESETS}
          selectedId={selectedPreset.id}
          onSelect={setSelectedPreset}
          onPlay={handlePlay}
          onEdit={handleEdit}
        />

        {/* Start CTA */}
        <View style={styles.ctaWrap}>
          <CTAButton label="Create New" onPress={() => router.push('/build')} />
        </View>

        {/* Recent */}
        <SectionLabel style={[styles.sectionLabel, { marginTop: 0 }]}>Recent</SectionLabel>
        {records.length === 0 ? (
          <Text style={styles.empty}>No workouts yet — start your first one above!</Text>
        ) : (
          <View style={styles.historyList}>
            {records.slice(0, 8).map((r, i) => (
              <HistoryRow
                key={r.id}
                title={r.name}
                subtitle={`${new Date(r.completedAt).toLocaleDateString()} · ${Math.round(r.durationSecs / 60)}:00 min · ${r.type}`}
                value={String(r.kcalBurned)}
                showDivider={i < Math.min(records.length, 8) - 1}
              />
            ))}
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.screenH,
    paddingTop: 40,
    paddingBottom: 24,
  },

  sectionLabel: {
    paddingHorizontal: Spacing.screenH,
    marginBottom: 12,
  },

  ctaWrap: {
    paddingHorizontal: Spacing.screenH,
    paddingBottom: Spacing.xxl,
    paddingTop: 14,
  },

  historyList: {
    paddingHorizontal: Spacing.screenH,
  },

  empty: {
    paddingHorizontal: Spacing.screenH,
    color: Colors.textMuted,
    fontSize: 13,
  },
});
