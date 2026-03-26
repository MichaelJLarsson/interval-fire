import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { useHistoryStore, computeStreak, weeklyMinutes } from '@/store/historyStore';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StatsScreen() {
  const { records } = useHistoryStore();
  const streak = computeStreak(records);
  const weekly = weeklyMinutes(records);
  const maxMins = Math.max(...weekly, 1);
  const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0

  const totalWorkouts = records.length;
  const totalMins = records.reduce((s, r) => s + Math.round(r.durationSecs / 60), 0);
  const totalKcal = records.reduce((s, r) => s + r.kcalBurned, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your{'\n'}Stats</Text>

        {/* Overview grid */}
        <View style={styles.grid}>
          {[
            { label: 'Workouts',       value: String(totalWorkouts), color: '#ff5050' },
            { label: 'Total time',     value: `${(totalMins / 60).toFixed(1)}h`, color: Colors.rest },
            { label: 'Kcal burned',    value: totalKcal.toLocaleString(), color: '#ff5050' },
            { label: 'Current streak', value: `${streak}d`, color: Colors.rest },
          ].map(({ label, value, color }) => (
            <View key={label} style={styles.statCard}>
              <Text style={styles.statLabel}>{label}</Text>
              <Text style={[styles.statValue, { color }]}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Weekly bar chart */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>This week</Text>
          <View style={styles.chartCard}>
            <View style={styles.bars}>
              {DAYS.map((day, i) => {
                const isToday = i === todayIdx;
                const pct = weekly[i] / maxMins;
                return (
                  <View key={day} style={styles.barCol}>
                    <View style={styles.barTrack}>
                      <View style={[
                        styles.barFill,
                        { height: `${Math.round(pct * 100)}%`, backgroundColor: isToday ? Colors.work : '#3a3a3a' }
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
          <Text style={styles.sectionLabel}>Personal bests</Text>
          <View style={styles.pbCard}>
            {[
              { label: 'Longest streak',  sub: 'Consecutive days',     value: `${streak}d`,        color: Colors.workLight },
              { label: 'Most rounds',     sub: 'In a single session',  value: String(records.length > 0 ? Math.max(...records.map(r => r.roundsCompleted)) : 0), color: Colors.rest },
              { label: 'Longest workout', sub: 'Single session',       value: records.length > 0 ? `${Math.round(Math.max(...records.map(r => r.durationSecs)) / 60)}:00` : '0:00', color: Colors.prep },
              { label: 'Most kcal',       sub: 'In a single session',  value: records.length > 0 ? String(Math.max(...records.map(r => r.kcalBurned))) : '0', color: '#b388ff' },
            ].map(({ label, sub, value, color }, i, arr) => (
              <View key={label} style={[styles.pbRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={[styles.pbIcon, { backgroundColor: color + '18' }]}>
                  <Text style={{ fontSize: 14 }}>{'🏆🔄⏱⚡'[i]}</Text>
                </View>
                <View style={styles.pbInfo}>
                  <Text style={styles.pbLabel}>{label}</Text>
                  <Text style={styles.pbSub}>{sub}</Text>
                </View>
                <Text style={[styles.pbValue, { color }]}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* History */}
        <Text style={[styles.sectionLabel, { paddingHorizontal: Spacing.screenH }]}>History</Text>
        <View style={{ paddingHorizontal: Spacing.screenH }}>
          {records.slice(0, 10).map((r, i) => (
            <View key={r.id} style={[styles.histRow, i === Math.min(records.length, 10) - 1 && { borderBottomWidth: 0 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.histName}>{r.name}</Text>
                <Text style={styles.histMeta}>
                  {new Date(r.completedAt).toLocaleDateString()} · {Math.round(r.durationSecs / 60)}:00 · {r.roundsCompleted} rounds
                </Text>
              </View>
              <View>
                <Text style={styles.kcal}>{r.kcalBurned}</Text>
                <Text style={styles.kcalUnit}>kcal</Text>
              </View>
            </View>
          ))}
          {records.length === 0 && (
            <Text style={styles.empty}>Complete a workout to see your history here.</Text>
          )}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: Colors.bg },
  title: { fontFamily: 'BarlowCondensed_900Black', fontSize: 28, textTransform: 'uppercase', color: Colors.textHi, lineHeight: 28, paddingHorizontal: Spacing.screenH, paddingTop: 36, paddingBottom: 20 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, paddingHorizontal: Spacing.screenH, marginBottom: 24 },
  statCard:  { width: '47.5%', backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: 14 },
  statLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  statValue: { fontFamily: 'BarlowCondensed_900Black', fontSize: 26 },

  section:      { paddingHorizontal: Spacing.screenH, marginBottom: 24 },
  sectionLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, color: Colors.textMuted, marginBottom: 14 },

  chartCard: { backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: 16 },
  bars:      { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 80 },
  barCol:    { flex: 1, alignItems: 'center', gap: 5, height: '100%' },
  barTrack:  { flex: 1, width: '100%', backgroundColor: '#2a2a2a', borderRadius: 4, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill:   { width: '100%', borderRadius: 4, minHeight: 2 },
  barDay:    { fontSize: 10, fontWeight: '600', color: '#555', textTransform: 'uppercase' },
  barDayToday: { color: Colors.work },

  pbCard: { backgroundColor: Colors.surface, borderRadius: Radii.lg, paddingHorizontal: 14, paddingVertical: 4 },
  pbRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  pbIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pbInfo: { flex: 1, paddingHorizontal: 12 },
  pbLabel: { fontSize: 13, fontWeight: '600', color: Colors.textMid },
  pbSub:   { fontSize: 11, color: Colors.textDim, marginTop: 2 },
  pbValue: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 22, textAlign: 'right' },

  histRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  histName: { fontSize: 13, fontWeight: '600', color: Colors.textMid },
  histMeta: { fontSize: 11, color: '#777', marginTop: 1 },
  kcal:     { fontFamily: 'BarlowCondensed_700Bold', fontSize: 19, color: '#ff5555', textAlign: 'right' },
  kcalUnit: { fontSize: 10, color: '#777', textAlign: 'right' },
  empty:    { color: Colors.textMuted, fontSize: 13, paddingBottom: 16 },
});
