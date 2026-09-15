import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import FastForwardFilledIcon from '@/components/shared/icons/FastForwardFilledIcon'
import PauseIcon from '@/components/shared/icons/PauseIcon'
import Toggle from '@/components/shared/Toggle'
import { Colors, Fonts, FontSizes, Radii, Spacing } from '@/constants/theme'

interface Props {
  workoutName: string
  phaseBadge: string
  phaseColor: string
  roundLabel: string
  dots: { done: boolean; current: boolean }[]
  audioOn: boolean
  voiceOn: boolean
  onToggleAudio: () => void
  onToggleVoice: () => void
  onStop: () => void
  onPauseResume: () => void
  onSkip: () => void
  isPaused: boolean
}

/**
 * Timer screen right-half panel used only in landscape. Chrome is always
 * visible here (no tap-to-reveal, no auto-hide), unlike the portrait
 * ChromeOverlay it mirrors the content of.
 */
export default function LandscapeControls({
  workoutName,
  phaseBadge,
  phaseColor,
  roundLabel,
  dots,
  audioOn,
  voiceOn,
  onToggleAudio,
  onToggleVoice,
  onStop,
  onPauseResume,
  onSkip,
  isPaused,
}: Props) {
  return (
    <View style={styles.panel}>
      <View style={styles.top}>
        <View style={styles.headerRow}>
          <Text style={styles.workoutName}>{workoutName}</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: phaseColor + '21', borderColor: phaseColor + '54' },
            ]}
          >
            <Text style={[styles.badgeText, { color: phaseColor }]}>{phaseBadge}</Text>
          </View>
        </View>
        <View style={styles.stepper}>
          <View style={styles.dots}>
            {dots.map((d, i) => (
              <View
                key={i}
                style={[styles.dot, d.done && styles.dotDone, d.current && styles.dotCurrent]}
              />
            ))}
          </View>
          <Text style={styles.roundLabel}>{roundLabel}</Text>
        </View>
      </View>

      <View style={styles.middle}>
        <View style={styles.controls}>
          <Pressable style={styles.buttonSmall} onPress={onStop}>
            <View style={styles.stopIcon} />
          </Pressable>
          <Pressable
            style={[styles.buttonLarge, isPaused && styles.buttonLargePaused]}
            onPress={onPauseResume}
          >
            {isPaused ? (
              <Text style={styles.buttonLargeIcon}>▶</Text>
            ) : (
              <PauseIcon color={Colors.white} size={28} />
            )}
          </Pressable>
          <Pressable style={styles.buttonSmall} onPress={onSkip}>
            <FastForwardFilledIcon color={Colors.textHi} size={22} />
          </Pressable>
        </View>
      </View>

      <View style={styles.toggles}>
        <Toggle on={audioOn} onPress={onToggleAudio}>
          <Text style={styles.toggleLabel}>Audio</Text>
        </Toggle>
        <Toggle on={voiceOn} onPress={onToggleVoice}>
          <Text style={styles.toggleLabel}>Voice</Text>
        </Toggle>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: Spacing.screenH,
    paddingRight: Spacing.screenH,
    paddingBottom: Spacing.screenH,
    paddingLeft: Spacing.sm,
  },
  top: { alignItems: 'flex-start', gap: Spacing.md, alignSelf: 'stretch' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    alignSelf: 'stretch',
  },
  workoutName: {
    fontFamily: Fonts.condensed,
    fontSize: FontSizes.headingMd,
    color: Colors.textHi,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.pill,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: FontSizes.label,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  stepper: { alignSelf: 'stretch' },
  dots: { flexDirection: 'row', gap: Spacing.xs },
  dot: { flex: 1, height: 3, borderRadius: 2, backgroundColor: Colors.progressPending },
  dotDone: { backgroundColor: Colors.progressDone },
  dotCurrent: { backgroundColor: Colors.progressActive },
  roundLabel: {
    fontSize: FontSizes.label,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Colors.textLo,
    marginTop: Spacing.md,
  },
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    alignSelf: 'stretch',
  },
  controls: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  buttonSmall: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopIcon: { width: 12, height: 12, backgroundColor: Colors.textMid },
  buttonLarge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.work,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLargePaused: { backgroundColor: Colors.textFaint },
  buttonLargeIcon: { color: Colors.white, fontSize: 22 },
  toggles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxl,
    alignSelf: 'stretch',
  },
  toggleLabel: {
    fontSize: FontSizes.label,
    fontWeight: '700',
    color: Colors.textLo,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
})
