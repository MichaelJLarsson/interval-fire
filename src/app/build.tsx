import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet, Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Stepper from '@/components/build/Stepper';
import CTAButton from '@/components/shared/CTAButton';
import PenIcon from '@/components/shared/icons/PenIcon';
import TrashIcon from '@/components/shared/icons/TrashIcon';
import XIcon from '@/components/shared/icons/XIcon';
import ScreenTitle from '@/components/shared/ScreenTitle';
import SectionLabel from '@/components/shared/SectionLabel';
import SummaryCard from '@/components/shared/SummaryCard';
import TypeChip, { ChipAccent } from '@/components/shared/TypeChip';
import WorkoutTypeIcon from '@/components/shared/WorkoutTypeIcon';
import {
  formatTime,
  Preset,   stepTime, stepWarmup,
  totalSecs,
WorkoutType,
} from '@/constants/presets';
import { Colors, Fonts, FontSizes, Radii, Spacing } from '@/constants/theme';
import { estimateKcal } from '@/store/historyStore';
import { usePresetsStore } from '@/store/presetsStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useWorkoutStore } from '@/store/workoutStore';

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
  const { audioEnabled, voiceEnabled, setAudio, setVoice } = useSettingsStore();

  const params = useLocalSearchParams<{ presetId?: string }>();
  const presetId = typeof params.presetId === 'string' ? params.presetId : undefined;
  const existingPreset = usePresetsStore((s) =>
    presetId ? s.presets.find((pr) => pr.id === presetId) : undefined
  );
  const addPreset = usePresetsStore((s) => s.addPreset);
  const updatePreset = usePresetsStore((s) => s.updatePreset);
  const deletePreset = usePresetsStore((s) => s.deletePreset);

  const [p, setP] = useState<Preset>(() => existingPreset ?? { ...DEFAULT });
  const isEditing = !!existingPreset;
  const [isNameEditing, setIsNameEditing] = useState(!isEditing);
  const nameInputRef = useRef<TextInput>(null);
  const nameSnapshotRef = useRef<string | null>(null);
  const isApplyingNameRef = useRef(false);
  const [showMore, setShowMore] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const open = useSharedValue(0);
  const chevronRotation = useSharedValue(0);

  const toggleMore = useCallback(() => {
    const timingConfig = { duration: 300, easing: Easing.out(Easing.ease) };
    const willOpen = !showMore;
    chevronRotation.value = withTiming(willOpen ? 1 : 0, timingConfig);
    if (willOpen) {
      setShowMore(true);
      open.value = withTiming(1, timingConfig);
    } else {
      open.value = withTiming(0, timingConfig, () => {
        runOnJS(setShowMore)(false);
      });
    }
  }, [showMore, chevronRotation, open]);

  const collapseStyle = useAnimatedStyle(() => ({
    height: contentHeight > 0 ? open.value * contentHeight : undefined,
    opacity: open.value,
    overflow: 'hidden' as const,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value * 180}deg` }],
  }));

  const update = (patch: Partial<Preset>) => setP((prev) => ({ ...prev, ...patch }));

  const persist = (): Preset => {
    const name = p.name.trim() || 'My Workout';
    const body = {
      name,
      type: p.type,
      workSecs: p.workSecs,
      restSecs: p.restSecs,
      rounds: p.rounds,
      prepSecs: p.prepSecs,
      warmupSecs: p.warmupSecs,
      cooldownSecs: p.cooldownSecs,
    };
    if (isEditing && presetId) {
      updatePreset(presetId, body);
      return { ...body, id: presetId };
    }
    const newId = addPreset(body);
    return { ...body, id: newId };
  };

  const handleSave = () => {
    persist();
    router.back();
  };

  const handleSaveStart = () => {
    const saved = persist();
    startWorkout(saved);
    router.dismiss();
    router.push('/timer');
  };

  const handleDelete = () => {
    if (!isEditing || !presetId) return;
    Alert.alert(
      'Delete workout?',
      `"${p.name}" will be removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deletePreset(presetId);
            router.back();
          },
        },
      ]
    );
  };

  const totalS = totalSecs(p);
  const mm = Math.floor(totalS / 60);
  const activeMins = Math.floor((p.rounds * p.workSecs) / 60);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerWrap}>
          <ScreenTitle line1={isEditing ? 'Edit' : 'Build'} line2="Workout" />
          <Pressable style={styles.returnBtn} onPress={() => router.back()}>
            <XIcon color={Colors.textHi} size={22} />
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

        {/* Workout name */}
        <View style={styles.section}>
          <SectionLabel style={styles.sectionLabelSpacing}>Give your workout a name</SectionLabel>
          {isEditing && !isNameEditing ? (
            <View style={styles.nameDisplay}>
              <Text style={styles.nameText} numberOfLines={1}>{p.name}</Text>
              <Pressable
                hitSlop={10}
                onPress={() => {
                  nameSnapshotRef.current = p.name;
                  setIsNameEditing(true);
                  requestAnimationFrame(() => nameInputRef.current?.focus());
                }}
              >
                <PenIcon color={Colors.textHi} size={18} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.nameEditRow}>
              <TextInput
                ref={nameInputRef}
                style={styles.nameInput}
                value={p.name}
                onChangeText={(t) => update({ name: t })}
                returnKeyType="done"
                onSubmitEditing={() => {
                  isApplyingNameRef.current = true;
                }}
                onBlur={() => {
                  if (!isEditing) return;
                  if (!isApplyingNameRef.current && nameSnapshotRef.current !== null) {
                    update({ name: nameSnapshotRef.current });
                  }
                  isApplyingNameRef.current = false;
                  nameSnapshotRef.current = null;
                  setIsNameEditing(false);
                }}
                placeholder="MY HOT HIIT"
                placeholderTextColor={Colors.inputPlaceholder}
                maxLength={24}
                autoFocus={isEditing && isNameEditing}
              />
              {isEditing && (
                <Pressable
                  style={styles.applyBtn}
                  onPress={() => {
                    isApplyingNameRef.current = true;
                    nameInputRef.current?.blur();
                  }}
                >
                  <Text style={styles.applyText}>Apply</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

        {/* More options toggle */}
        <Pressable style={styles.moreToggle} onPress={toggleMore}>
          <Text style={styles.moreLabel}>Optional settings</Text>
          <Animated.Text style={[styles.moreChev, chevronStyle]}>▼</Animated.Text>
        </Pressable>

        {showMore && (
          <Animated.View style={collapseStyle}>
            <View
              style={styles.moreSection}
              onLayout={(e) => {
                const h = e.nativeEvent.layout.height;
                if (h > 0 && h !== contentHeight) setContentHeight(h);
              }}
            >
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
              <SectionLabel style={{ marginTop: Spacing.xxl, ...styles.sectionLabelSpacing }}>Sound & voice</SectionLabel>
              {[
                { label: 'Audio cues', sub: 'Three second warning before each switch', val: audioEnabled, set: setAudio },
                { label: 'Voice Announcements', sub: '"Work!", "Rest" callouts', val: voiceEnabled, set: setVoice },
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
            </View>
          </Animated.View>
        )}

        {/* Summary grid */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryRow}>
            <SummaryCard label="Intervals" value={String(p.rounds)} style={styles.summaryItem} />
            <SummaryCard label="Total workout time" value={`${mm} min`} variant="eucalyptus" style={styles.summaryItem} />
          </View>
          <View style={styles.summaryRow}>
            <SummaryCard label="Kcal" value={String(estimateKcal(p.workSecs, p.rounds, p.type, p.warmupSecs, p.cooldownSecs))} style={styles.summaryItem} />
            <SummaryCard label="Active phase" value={`${activeMins} min`} variant="eucalyptus" style={styles.summaryItem} />
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.ctaFooter}>
          <View style={styles.ctaStack}>
            <CTAButton label="Start Workout" onPress={handleSaveStart} />
            <CTAButton label="Save" variant="outline" onPress={handleSave} />
            {isEditing && (
              <Pressable style={styles.deleteBtn} onPress={handleDelete}>
                <TrashIcon color={Colors.work} size={18} />
                <Text style={styles.deleteText}>Delete workout</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },

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
    paddingBottom: Spacing.xxl,
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

  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  nameInput: {
    flex: 1,
    backgroundColor: Colors.planeBlack,
    borderWidth: 1,
    borderColor: '#7c7c7c',
    borderRadius: Radii.md,
    height: 54,
    paddingHorizontal: 17,
    fontFamily: Fonts.condensedBold,
    fontSize: FontSizes.headingMd,
    color: Colors.textHi,
    textTransform: 'uppercase',
    letterSpacing: -0.4,
  },
  nameDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 54,
  },
  nameText: {
    fontFamily: Fonts.condensedBold,
    fontSize: FontSizes.headingMd,
    color: Colors.textHi,
    textTransform: 'uppercase',
    letterSpacing: -0.4,
    flexShrink: 1,
  },
  applyBtn: {
    height: 54,
    paddingHorizontal: 18,
    borderRadius: Radii.md,
    backgroundColor: Colors.offBlack,
    borderWidth: 1,
    borderColor: Colors.work,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontFamily: Fonts.condensed,
    fontSize: FontSizes.headingMd,
    color: Colors.work,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
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

  ctaFooter: {
    paddingBottom: Spacing.screenV,
  },
  ctaStack: {
    paddingHorizontal: Spacing.screenH,
    gap: Spacing.sm,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginTop: Spacing.md,
  },
  deleteText: {
    color: Colors.work,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
});
