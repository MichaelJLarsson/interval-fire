import Stepper from '@/components/build/Stepper';
import CTAButton from '@/components/shared/CTAButton';
import GradientScreen from '@/components/shared/GradientScreen';
import ScreenTitle from '@/components/shared/ScreenTitle';
import SectionLabel from '@/components/shared/SectionLabel';
import SummaryCard from '@/components/shared/SummaryCard';
import TypeChip, { ChipAccent } from '@/components/shared/TypeChip';
import WorkoutTypeIcon from '@/components/shared/WorkoutTypeIcon';
import ReturnIcon from '@/components/shared/icons/ReturnIcon';
import {
  Preset, WorkoutType,
  formatTime,
  stepTime, stepWarmup,
  totalSecs,
} from '@/constants/presets';
import { Colors, FontSizes, Radii, Spacing } from '@/constants/theme';
import { useSettingsStore } from '@/store/settingsStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet, Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

const DEFAULT: Preset = {
  id: 'custom',
  name: 'My Workout',
  type: 'hiit',
  workSecs: 20, restSecs: 10, rounds: 8,
  prepSecs: 10, warmupSecs: 0, cooldownSecs: 0,
};

const TYPES: { key: WorkoutType; label: string; accent: ChipAccent }[] = [
  { key: 'hiit',     label: 'HIIT',     accent: 'work' },
  { key: 'running',  label: 'Running',  accent: 'prep' },
  { key: 'cardio',   label: 'Cardio',   accent: 'rest' },
  { key: 'strength', label: 'Strength', accent: 'strength' },
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

  const totalS = totalSecs(p);
  const mm = Math.floor(totalS / 60);
  const ss = totalS % 60;
  const totalLabel = `${mm}:${String(ss).padStart(2, '0')}`;
  const activeMins = Math.floor((p.rounds * p.workSecs) / 60);

  return (
    <GradientScreen>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerWrap}>
          <ScreenTitle line1="Build" line2="Workout" />
          <Pressable style={styles.returnBtn} onPress={() => router.back()}>
            <ReturnIcon color={Colors.textHi} size={22} />
          </Pressable>
        </View>

        {/* Type selector */}
        <View style={styles.section}>
          <SectionLabel style={styles.sectionLabelSpacing}>Type</SectionLabel>
          <View style={styles.typeGrid}>
            {TYPES.map(({ key, label, accent }) => (
              <TypeChip
                key={key}
                label={label}
                accent={accent}
                selected={p.type === key}
                onPress={() => update({ type: key })}
                icon={
                  <WorkoutTypeIcon
                    type={key}
                    color={p.type === key ? Colors[accent] : Colors.textLo}
                  />
                }
              />
            ))}
          </View>
        </View>

        {/* Interval settings */}
        <View style={styles.section}>
          <SectionLabel style={styles.sectionLabelSpacing}>Interval settings</SectionLabel>
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
        </View>

        {/* More options toggle */}
        <Pressable style={styles.moreToggle} onPress={() => setShowMore(!showMore)}>
          <Text style={styles.moreLabel}>Optional settings</Text>
          <Text style={styles.moreChev}>{showMore ? '▲' : '▼'}</Text>
        </Pressable>

        {showMore && (
          <View style={styles.moreSection}>
            {/* Additional settings */}
            <SectionLabel style={styles.sectionLabelSpacing}>Additional settings</SectionLabel>
            <Stepper label="Warmup" sublabel="Easy pace before intervals"
              value={p.warmupSecs === 0 ? 'Off' : formatTime(p.warmupSecs)}
              onDecrement={() => update({ warmupSecs: Math.max(0, stepWarmup(p.warmupSecs, -1)) })}
              onIncrement={() => update({ warmupSecs: stepWarmup(p.warmupSecs, 1) })} />
            <Stepper label="Cooldown" sublabel="Easy pace after intervals"
              value={p.cooldownSecs === 0 ? 'Off' : formatTime(p.cooldownSecs)}
              onDecrement={() => update({ cooldownSecs: Math.max(0, stepWarmup(p.cooldownSecs, -1)) })}
              onIncrement={() => update({ cooldownSecs: stepWarmup(p.cooldownSecs, 1) })} />
            <Stepper label="Countdown" sublabel="Prep time before workout"
              value={p.prepSecs === 0 ? 'Off' : formatTime(p.prepSecs)}
              onDecrement={() => update({ prepSecs: Math.max(0, stepTime(p.prepSecs, -1)) })}
              onIncrement={() => update({ prepSecs: stepTime(p.prepSecs, 1) })} />

            {/* Sound & voice */}
            <SectionLabel style={[styles.sectionLabelSpacing, { marginTop: Spacing.xxl }]}>Sound & voice</SectionLabel>
            {[
              { label: 'Audio cues', sub: 'Beep at each interval change', val: audioEnabled, set: setAudio },
              { label: 'Voice Announcements', sub: '"Work!", "Rest" callouts', val: voiceEnabled, set: setVoice },
              { label: 'Three second warning', sub: 'Alert before each switch', val: warningEnabled, set: setWarning },
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
                  thumbColor={Colors.white}
                />
              </View>
            ))}

            {/* Workout name */}
            <SectionLabel style={[styles.sectionLabelSpacing, { marginTop: Spacing.xxl }]}>Give your workout a name</SectionLabel>
            <TextInput
              style={styles.nameInput}
              value={p.name}
              onChangeText={(t) => update({ name: t })}
              placeholder="MY HOT HIIT"
              placeholderTextColor={Colors.inputPlaceholder}
              maxLength={24}
            />
          </View>
        )}

        {/* Summary grid */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryRow}>
            <SummaryCard label="Intervals" value={String(p.rounds)} style={styles.summaryItem} />
            <SummaryCard label="Total workout time" value={`${mm} min`} variant="eucalyptus" style={styles.summaryItem} />
          </View>
          <View style={styles.summaryRow}>
            <SummaryCard label="Kcal" value={String(Math.round(totalS * 0.15))} style={styles.summaryItem} />
            <SummaryCard label="Active phase" value={`${activeMins} min`} variant="eucalyptus" style={styles.summaryItem} />
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.ctaRow}>
          <CTAButton label="Cancel" variant="outline" onPress={() => router.back()} style={styles.ctaHalf} />
          <CTAButton label="Ready to go?" onPress={handleSaveStart} style={styles.ctaHalf} />
        </View>
      </ScrollView>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },

  headerWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenH,
    paddingTop: Spacing.screenV,
    paddingBottom: Spacing.xxl,
  },
  returnBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: {
    paddingHorizontal: Spacing.screenH,
    marginBottom: Spacing.xxl,
  },
  sectionLabelSpacing: { marginBottom: 7 },

  typeGrid: { flexDirection: 'row', gap: Spacing.sm },

  steppers: { gap: 10 },

  moreToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 14,
    marginBottom: Spacing.xxl,
  },
  moreLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.textHi,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  moreChev: { fontSize: FontSizes.label, color: Colors.textHi },

  moreSection: {
    gap: 10,
    paddingHorizontal: Spacing.screenH,
    marginBottom: Spacing.xxl,
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.planeBlack,
    borderRadius: Radii.xl,
    paddingHorizontal: 18,
    paddingVertical: 16,
    height: 68,
  },
  toggleLabel: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.textMid,
  },
  toggleSub: {
    fontSize: FontSizes.caption,
    fontWeight: '500',
    color: Colors.textLo,
    marginTop: 1,
  },

  nameInput: {
    backgroundColor: Colors.planeBlack,
    borderWidth: 1,
    borderColor: '#7c7c7c',
    borderRadius: Radii.md,
    height: 46,
    paddingHorizontal: 17,
    fontWeight: '500',
    fontSize: FontSizes.body,
    color: Colors.textHi,
    textTransform: 'uppercase',
  },

  summaryGrid: {
    paddingHorizontal: Spacing.screenH,
    gap: 10,
    marginBottom: Spacing.xxl,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryItem: { flex: 1 },

  ctaRow: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: Spacing.screenH,
    paddingBottom: Spacing.screenV,
  },
  ctaHalf: { flex: 1 },
});
