import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, TextInput, StyleSheet, SafeAreaView, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radii } from '@/constants/theme';
import {
  Preset, WorkoutType, TYPE_LABELS, stepTime, stepWarmup, formatTime, totalSecs,
} from '@/constants/presets';
import { useWorkoutStore } from '@/store/workoutStore';
import { useSettingsStore } from '@/store/settingsStore';
import Stepper from '@/components/build/Stepper';

const DEFAULT: Preset = {
  id: 'custom',
  name: 'My Workout',
  type: 'hiit',
  workSecs: 20, restSecs: 10, rounds: 8,
  prepSecs: 10, warmupSecs: 0, cooldownSecs: 0,
};

const TYPES: { key: WorkoutType; label: string; color: string }[] = [
  { key: 'hiit',     label: 'HIIT',     color: Colors.workLight },
  { key: 'running',  label: 'Run',      color: Colors.rest },
  { key: 'cardio',   label: 'Cardio',   color: Colors.prep },
  { key: 'strength', label: 'Strength', color: '#b388ff' },
];

export default function BuildScreen() {
  const router = useRouter();
  const { startWorkout } = useWorkoutStore();
  const { audioEnabled, voiceEnabled, warningEnabled, setAudio, setVoice, setWarning } = useSettingsStore();

  const [p, setP] = useState<Preset>({ ...DEFAULT });
  const [showMore, setShowMore] = useState(false);

  const update = (patch: Partial<Preset>) => setP((prev) => ({ ...prev, ...patch }));

  const handleSaveStart = () => {
    startWorkout(p);
    router.push('/timer');
  };

  const intervalSecs = p.rounds * (p.workSecs + p.restSecs);
  const totalS = totalSecs(p);
  const mm = Math.floor(totalS / 60);
  const ss = totalS % 60;
  const totalLabel = `${mm}:${String(ss).padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerWrap}>
          <Text style={styles.title}>Build{'\n'}Workout</Text>
          <Text style={styles.subtitle}>Customize your interval structure</Text>
        </View>

        {/* Type selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Type</Text>
          <View style={styles.typeGrid}>
            {TYPES.map(({ key, label, color }) => (
              <Pressable
                key={key}
                style={[styles.typeBtn, p.type === key && { borderColor: Colors.work, backgroundColor: '#ff3d3d18' }]}
                onPress={() => update({ type: key })}
              >
                <Text style={[styles.typeBtnLabel, p.type === key && { color }]}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Primary steppers */}
        <View style={styles.steppers}>
          <Stepper label="Work" sublabel="Active interval"
            value={formatTime(p.workSecs)}
            onDecrement={() => update({ workSecs: Math.max(5, stepTime(p.workSecs, -1)) })}
            onIncrement={() => update({ workSecs: stepTime(p.workSecs, 1) })} />
          <Stepper label="Rest" sublabel="Recovery interval"
            value={p.restSecs === 0 ? 'Off' : formatTime(p.restSecs)}
            onDecrement={() => update({ restSecs: Math.max(0, stepTime(p.restSecs, -1)) })}
            onIncrement={() => update({ restSecs: stepTime(p.restSecs, 1) })} />
          <Stepper label="Rounds" sublabel="Sets to complete"
            value={String(p.rounds)}
            onDecrement={() => update({ rounds: Math.max(1, p.rounds - 1) })}
            onIncrement={() => update({ rounds: Math.min(30, p.rounds + 1) })} />
        </View>

        <Text style={styles.intervalTotal}>Intervals: {formatTime(intervalSecs)}</Text>

        {/* More options toggle */}
        <Pressable style={styles.moreToggle} onPress={() => setShowMore(!showMore)}>
          <Text style={styles.moreLabel}>{showMore ? 'Fewer options' : 'More options'}</Text>
          <Text style={styles.moreChev}>{showMore ? '▲' : '▼'}</Text>
        </Pressable>

        {showMore && (
          <View style={styles.moreSection}>
            {/* Name */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Workout name</Text>
              <TextInput
                style={styles.nameInput}
                value={p.name}
                onChangeText={(t) => update({ name: t })}
                placeholder="MY WORKOUT"
                placeholderTextColor="#666"
                maxLength={24}
              />
            </View>

            {/* Warmup */}
            <Stepper label="Warmup" sublabel="Easy pace before intervals"
              size="small"
              value={p.warmupSecs === 0 ? 'Off' : formatTime(p.warmupSecs)}
              onDecrement={() => update({ warmupSecs: Math.max(0, stepWarmup(p.warmupSecs, -1)) })}
              onIncrement={() => update({ warmupSecs: stepWarmup(p.warmupSecs, 1) })} />

            {/* Cooldown */}
            <Stepper label="Cooldown" sublabel="Easy pace after intervals"
              size="small"
              value={p.cooldownSecs === 0 ? 'Off' : formatTime(p.cooldownSecs)}
              onDecrement={() => update({ cooldownSecs: Math.max(0, stepWarmup(p.cooldownSecs, -1)) })}
              onIncrement={() => update({ cooldownSecs: stepWarmup(p.cooldownSecs, 1) })} />

            {/* Prep time */}
            <Stepper label="Prep time" sublabel="Countdown before start"
              size="small"
              value={p.prepSecs === 0 ? 'Off' : formatTime(p.prepSecs)}
              onDecrement={() => update({ prepSecs: Math.max(0, stepTime(p.prepSecs, -1)) })}
              onIncrement={() => update({ prepSecs: stepTime(p.prepSecs, 1) })} />

            {/* Sound toggles */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Sound &amp; Voice</Text>
              {[
                { label: 'Audio cues', sub: 'Beep at each interval change', val: audioEnabled, set: setAudio },
                { label: 'Voice announcements', sub: '"Work!" / "Rest!" callouts', val: voiceEnabled, set: setVoice },
                { label: '3-second warning', sub: 'Alert before each switch', val: warningEnabled, set: setWarning },
              ].map(({ label, sub, val, set }) => (
                <View key={label} style={styles.toggleRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.toggleLabel}>{label}</Text>
                    <Text style={styles.toggleSub}>{sub}</Text>
                  </View>
                  <Switch
                    value={val}
                    onValueChange={set}
                    trackColor={{ false: '#2c2c2c', true: Colors.work }}
                    thumbColor={val ? Colors.white : '#ccc'}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Summary card */}
        <View style={styles.summary}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryName}>{p.name.toUpperCase()}</Text>
            <Text style={styles.summaryType}>{TYPE_LABELS[p.type]}</Text>
          </View>
          <View style={styles.summaryRight}>
            <Text style={styles.summaryTime}>{totalLabel}</Text>
            <Text style={styles.summaryTimeLabel}>total</Text>
          </View>
        </View>

        {/* Save & start */}
        <View style={styles.ctaWrap}>
          <Pressable style={styles.cta} onPress={handleSaveStart}>
            <Text style={styles.ctaText}>Save &amp; start</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },

  headerWrap: { paddingHorizontal: Spacing.screenH, paddingTop: 36, paddingBottom: 20 },
  title:      { fontFamily: 'BarlowCondensed_900Black', fontSize: 28, textTransform: 'uppercase', color: Colors.textHi, lineHeight: 28 },
  subtitle:   { fontSize: 12, color: '#999', marginTop: 4 },

  section:      { paddingHorizontal: Spacing.screenH, marginBottom: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: Colors.textLo, marginBottom: 8 },

  typeGrid:     { flexDirection: 'row', gap: 8 },
  typeBtn:      { flex: 1, backgroundColor: Colors.surfaceLo, borderWidth: 2, borderColor: Colors.border, borderRadius: Radii.md, paddingVertical: 10, alignItems: 'center' },
  typeBtnLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: '#999' },

  steppers:      { paddingHorizontal: Spacing.screenH, gap: 10, marginBottom: 10 },
  intervalTotal: { textAlign: 'center', fontSize: 14, fontWeight: '600', color: Colors.textMuted, paddingVertical: 6 },

  moreToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  moreLabel:  { fontSize: 12, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  moreChev:   { fontSize: 10, color: Colors.textMuted },
  moreSection: { gap: 10, paddingHorizontal: Spacing.screenH },

  nameInput: {
    backgroundColor: Colors.surfaceLo, borderWidth: 2, borderColor: Colors.border,
    borderRadius: Radii.md, padding: 12,
    fontFamily: 'BarlowCondensed_700Bold', fontSize: 22, color: Colors.textHi, letterSpacing: 1,
  },

  toggleRow:   { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceLo, borderRadius: Radii.md, padding: 13, marginBottom: 8 },
  toggleLabel: { fontSize: 13, fontWeight: '600', color: Colors.textMid },
  toggleSub:   { fontSize: 11, color: '#999', marginTop: 1 },

  summary:      { marginHorizontal: Spacing.screenH, marginTop: 24, backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: 14, borderWidth: 1.5, borderColor: Colors.borderHi, flexDirection: 'row', alignItems: 'center', gap: 12 },
  summaryLeft:  { flex: 1 },
  summaryName:  { fontFamily: 'BarlowCondensed_900Black', fontSize: 19, textTransform: 'uppercase', color: Colors.textHi, letterSpacing: 1 },
  summaryType:  { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
  summaryRight: { alignItems: 'flex-end' },
  summaryTime:  { fontFamily: 'BarlowCondensed_900Black', fontSize: 26, color: Colors.work },
  summaryTimeLabel: { fontSize: 10, color: Colors.textDim, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 3 },

  ctaWrap: { padding: Spacing.screenH, paddingTop: 12 },
  cta:     { backgroundColor: Colors.textHi, borderRadius: Radii.lg, paddingVertical: 16, alignItems: 'center' },
  ctaText: { fontFamily: 'BarlowCondensed_900Black', fontSize: 20, color: '#111', textTransform: 'uppercase', letterSpacing: 0.5 },
});
