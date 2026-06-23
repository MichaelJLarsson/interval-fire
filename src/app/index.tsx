import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import PresetCarousel from '@/components/home/PresetCarousel';
import CTAButton from '@/components/shared/CTAButton';
import FireIcon from '@/components/shared/FireIcon';
import GradientScreen from '@/components/shared/GradientScreen';
import HistoryRow from '@/components/shared/HistoryRow';
import SectionLabel from '@/components/shared/SectionLabel';
import StreakPill from '@/components/shared/StreakPill';
import { formatRelativeDate } from '@/constants/mockHistory';
import { Preset, TYPE_LABELS } from '@/constants/presets';
import { Colors, Fonts, FontSizes, Radii, Spacing } from '@/constants/theme';
import { computeStreak, useHistoryStore } from '@/store/historyStore';
import { usePresetsStore } from '@/store/presetsStore';
import { useWorkoutStore } from '@/store/workoutStore';

export default function HomeScreen() {
  const router = useRouter();
  const { startWorkout } = useWorkoutStore();
  const { records } = useHistoryStore();
  const presets = usePresetsStore((s) => s.presets);
  const [selectedId, setSelectedId] = useState<string | null>(presets[0]?.id ?? null);

  useEffect(() => {
    if (presets.length === 0) {
      if (selectedId !== null) setSelectedId(null);
    } else if (!presets.some((p) => p.id === selectedId)) {
      setSelectedId(presets[0].id);
    }
  }, [presets, selectedId]);

  const scrollRef = useRef<ScrollView>(null);
  const moreStatsScale = useRef(new Animated.Value(1)).current;
  const streak = computeStreak(records);

  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const handlePlay = (preset: Preset) => {
    startWorkout(preset);
    router.push('/timer');
  };

  const handleEdit = (preset: Preset) => {
    router.push({ pathname: '/build', params: { presetId: preset.id } });
  };

  return (
    <GradientScreen>
      <ScrollView
        ref={scrollRef}
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
        {presets.length === 0 ? (
          <View style={styles.emptyCardWrap}>
            <Pressable style={styles.emptyCard} onPress={() => router.push('/build')}>
              <Text style={styles.emptyTitle}>No workouts yet</Text>
              <Text style={styles.emptySubtitle}>Tap to create your first one</Text>
            </Pressable>
          </View>
        ) : (
          <PresetCarousel
            presets={presets}
            selectedId={selectedId ?? ''}
            onSelect={(p) => setSelectedId(p.id)}
            onPlay={handlePlay}
            onEdit={handleEdit}
          />
        )}

        {/* Start CTA */}
        <View style={styles.ctaWrap}>
          <CTAButton label="Create New" onPress={() => router.push('/build')} />
        </View>

        {/* Recent */}
        <SectionLabel style={[styles.sectionLabel, { marginTop: 0, marginBottom: 2 }]}>Recent</SectionLabel>
        <View style={styles.historyList}>
          {records.length === 0 ? (
            <Text style={styles.emptyRecent}>Complete a workout to see your recent activity.</Text>
          ) : (
            records.slice(0, 3).map((r, i, arr) => {
              const mins = Math.round(r.durationSecs / 60);
              return (
                <HistoryRow
                  key={r.id}
                  title={r.name}
                  subtitle={`${formatRelativeDate(r.completedAt)} · ${mins}:00 min · ${TYPE_LABELS[r.type]}`}
                  value={String(r.kcalBurned)}
                  showDivider={i < arr.length - 1}
                />
              );
            })
          )}
        </View>

        {/* More Stats */}
        <View style={styles.moreStatsWrap}>
          <Animated.View style={{ transform: [{ scale: moreStatsScale }] }}>
            <Pressable
              style={styles.moreStatsBtn}
              onPress={() => router.push('/stats')}
              onPressIn={() => Animated.timing(moreStatsScale, { toValue: 0.95, duration: 100, useNativeDriver: true }).start()}
              onPressOut={() => Animated.timing(moreStatsScale, { toValue: 1, duration: 100, useNativeDriver: true }).start()}
            >
              <Text style={styles.moreStatsText}>MORE STATS</Text>
            </Pressable>
          </Animated.View>
        </View>
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
  emptyRecent: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    paddingVertical: 8,
  },

  moreStatsWrap: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: 18,
    alignItems: 'flex-start',
  },
  moreStatsBtn: {
    height: 46,
    paddingHorizontal: 17,
    borderRadius: 7,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreStatsText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSizes.label,
    color: Colors.textLo,
    letterSpacing: 0.2,
  },

  emptyCardWrap: {
    paddingHorizontal: Spacing.screenH,
  },
  emptyCard: {
    minHeight: 120,
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: Fonts.condensed,
    fontSize: FontSizes.headingMd,
    textTransform: 'uppercase',
    color: Colors.textHi,
    letterSpacing: 0.5,
  },
  emptySubtitle: {
    fontSize: FontSizes.caption,
    color: Colors.textLo,
    marginTop: 6,
  },
});
