import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Colors, FontSizes, Spacing, Radii } from '@/constants/theme';
import { useHistoryStore, computeStreak, weeklyMinutes } from '@/store/historyStore';
import ScreenTitle from '@/components/shared/ScreenTitle';
import SectionLabel from '@/components/shared/SectionLabel';
import SummaryCard from '@/components/shared/SummaryCard';
import PersonalBestRow from '@/components/shared/PersonalBestRow';
import HistoryRow from '@/components/shared/HistoryRow';
import XIcon from '@/components/shared/icons/XIcon';
import { router } from 'expo-router';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StatsScreen() {
  const { records } = useHistoryStore();
  const streak = computeStreak(records);
  const weekly = weeklyMinutes(records);
  const maxMins = Math.max(...weekly, 1);
  const todayIdx = (new Date().getDay() + 6) % 7;
  // Order columns so today is the last (rightmost) bar.
  const columns = Array.from({ length: 7 }, (_, i) => (todayIdx + 1 + i) % 7);

  const totalWorkouts = records.length;
  const totalMins = records.reduce((s, r) => s + Math.round(r.durationSecs / 60), 0);
  const totalKcal = records.reduce((s, r) => s + r.kcalBurned, 0);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerWrap}>
          <ScreenTitle line1="Your" line2="Stats" />
          <Pressable style={styles.returnBtn} onPress={() => router.back()}>
            <XIcon color={Colors.textHi} size={22} />
          </Pressable>
        </View>

        {/* Overview grid */}
        <View style={styles.grid}>
          <SummaryCard label="Workouts" value={String(totalWorkouts)} style={styles.gridItem} />
          <SummaryCard label="Total time" value={`${(totalMins / 60).toFixed(1)}h`} variant="eucalyptus" style={styles.gridItem} />
          <SummaryCard label="Kcal burned" value={totalKcal.toLocaleString()} style={styles.gridItem} />
          <SummaryCard label="Current streak" value={`${streak}d`} variant="eucalyptus" style={styles.gridItem} />
        </View>

        {/* Weekly bar chart */}
        <View style={styles.section}>
          <SectionLabel style={styles.sectionLabelSpacing}>This week</SectionLabel>
          <View style={styles.chartCard}>
            <View style={styles.bars}>
              {columns.map((idx, col) => {
                const isToday = col === 6;
                const pct = weekly[idx] / maxMins;
                const day = DAY_NAMES[idx];
                return (
                  <View key={day} style={styles.barCol}>
                    <View style={styles.barTrack}>
                      <View style={[
                        styles.barFill,
                        { height: `${Math.round(pct * 100)}%`, backgroundColor: isToday ? Colors.barToday : Colors.barFill }
                      ]} />
                    </View>
                    <Text style={[styles.barDay, isToday && styles.barDayToday]}>{day}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Personal bests */}
        <View style={styles.section}>
          <SectionLabel style={styles.sectionLabelSpacing}>Personal bests</SectionLabel>
          <View style={styles.pbCard}>
            {[
              { title: 'Longest streak',  sub: 'Consecutive days',     value: `${streak}d`,        iconBg: Colors.workBgTint2, valueColor: Colors.workLight, emoji: '🏆' },
              { title: 'Most rounds',     sub: 'In a single session',  value: String(records.length > 0 ? Math.max(...records.map(r => r.roundsCompleted)) : 0), iconBg: Colors.restIconBg, valueColor: Colors.rest, emoji: '🔄' },
              { title: 'Longest workout', sub: 'Single session',       value: records.length > 0 ? `${Math.round(Math.max(...records.map(r => r.durationSecs)) / 60)}:00` : '0:00', iconBg: Colors.prepIconBg, valueColor: Colors.prep, emoji: '⏱' },
              { title: 'Most kcal',       sub: 'In a single session',  value: records.length > 0 ? String(Math.max(...records.map(r => r.kcalBurned))) : '0', iconBg: Colors.plumIconBg, valueColor: Colors.strength, emoji: '⚡' },
            ].map(({ title, sub, value, iconBg, valueColor, emoji }, i, arr) => (
              <PersonalBestRow
                key={title}
                icon={<Text style={{ fontSize: 18 }}>{emoji}</Text>}
                iconBg={iconBg}
                title={title}
                subtitle={sub}
                value={value}
                valueColor={valueColor}
                showDivider={i < arr.length - 1}
              />
            ))}
          </View>
        </View>

        {/* History */}
        <View style={styles.section}>
          <SectionLabel style={styles.sectionLabelSpacing}>History</SectionLabel>
          {records.slice(0, 10).map((r, i) => (
            <HistoryRow
              key={r.id}
              title={r.name}
              subtitle={`${new Date(r.completedAt).toLocaleDateString()} · ${Math.round(r.durationSecs / 60)}:00 · ${r.roundsCompleted} rounds`}
              value={String(r.kcalBurned)}
              showDivider={i < Math.min(records.length, 10) - 1}
            />
          ))}
          {records.length === 0 && (
            <Text style={styles.empty}>Complete a workout to see your history here.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenH,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  returnBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: Spacing.screenH,
    marginBottom: Spacing.xxl,
  },
  gridItem: { width: '47.5%' },

  section: {
    paddingHorizontal: Spacing.screenH,
    marginBottom: Spacing.xxl,
  },
  sectionLabelSpacing: { marginBottom: 14 },

  chartCard: {
    backgroundColor: Colors.planeBlack,
    borderRadius: Radii.lg,
    paddingHorizontal: 17,
    paddingVertical: 19,
  },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 7, height: 68 },
  barCol: { flex: 1, alignItems: 'center', gap: 12, height: '100%' },
  barTrack: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.barTrack,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: { width: '100%', borderRadius: 4, minHeight: 2 },
  barDay: {
    fontSize: FontSizes.label,
    fontWeight: '700',
    color: Colors.textLo,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  barDayToday: { color: Colors.work },

  pbCard: {
    backgroundColor: Colors.planeBlack,
    borderRadius: Radii.lg,
    paddingHorizontal: 17,
    paddingVertical: 4,
  },

  empty: { color: Colors.textMuted, fontSize: FontSizes.body, paddingBottom: 16 },
});
