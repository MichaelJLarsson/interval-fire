import PresetCarousel from '@/components/home/PresetCarousel';
import FireIcon from '@/components/shared/FireIcon';
import CTAButton from '@/components/shared/CTAButton';
import GradientScreen from '@/components/shared/GradientScreen';
import SectionLabel from '@/components/shared/SectionLabel';
import StreakPill from '@/components/shared/StreakPill';
import HistoryRow from '@/components/shared/HistoryRow';
import { PRESETS, Preset, TYPE_LABELS } from '@/constants/presets';
import { MOCK_HISTORY, formatRelativeDate } from '@/constants/mockHistory';
import { Colors, Fonts, FontSizes, Radii, Spacing } from '@/constants/theme';
import { computeStreak, useHistoryStore } from '@/store/historyStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { startWorkout } = useWorkoutStore();
  const { records } = useHistoryStore();
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);

  const scrollRef = useRef<ScrollView>(null);
  const moreStatsScale = useRef(new Animated.Value(1)).current;
  const streak = computeStreak(records);
  const historyToShow = records.length > 0 ? records : MOCK_HISTORY;

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
    // Navigate to build screen (future: pre-fill with preset values)
    router.push('/build');
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
        <View style={styles.historyList}>
          {historyToShow.slice(0, 8).map((r, i) => {
            const mins = Math.round(r.durationSecs / 60);
            return (
              <HistoryRow
                key={r.id}
                title={r.name}
                subtitle={`${formatRelativeDate(r.completedAt)} · ${mins}:00 min · ${TYPE_LABELS[r.type]}`}
                value={String(r.kcalBurned)}
                showDivider={i < Math.min(historyToShow.length, 8) - 1}
              />
            );
          })}
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

  moreStatsWrap: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: 18,
    alignItems: 'flex-start',
  },
  moreStatsBtn: {
    height: 46,
    paddingHorizontal: 17,
    borderRadius: 7,
    backgroundColor: Colors.planeBlack,
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
});
