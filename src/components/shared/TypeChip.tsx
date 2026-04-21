import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSizes, Radii } from '@/constants/theme';
import AnimatedChipIcon from './AnimatedChipIcon';

export type ChipAccent = 'work' | 'prep' | 'rest' | 'strength';

const ACCENT_STYLES: Record<ChipAccent, { bg: string; border: string; text: string }> = {
  work:     { bg: Colors.workBgTint3, border: Colors.work,     text: Colors.work },
  prep:     { bg: Colors.prepIconBg,  border: Colors.prep,     text: Colors.prep },
  rest:     { bg: Colors.restIconBg,  border: Colors.rest,     text: Colors.rest },
  strength: { bg: Colors.plumIconBg,  border: Colors.strength, text: Colors.strength },
};

interface Props {
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  accent?: ChipAccent;
  onPress: () => void;
  style?: ViewStyle;
}

export default function TypeChip({ label, icon, selected = false, accent = 'work', onPress, style }: Props) {
  const accentStyle = ACCENT_STYLES[accent];
  const selectedStyle = selected
    ? { backgroundColor: accentStyle.bg, borderColor: accentStyle.border }
    : null;

  return (
    <Pressable
      style={[styles.chip, selected ? selectedStyle : styles.default, style]}
      onPress={onPress}
    >
      {icon ? (
        <AnimatedChipIcon selected={selected} accent={accent}>
          {icon}
        </AnimatedChipIcon>
      ) : null}
      <Text style={[styles.label, selected && { color: accentStyle.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    height: 65,
    borderRadius: Radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  default: {
    backgroundColor: Colors.planeBlack,
    borderColor: Colors.border,
  },
  label: {
    fontSize: FontSizes.label,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: Colors.textHi,
  },
});
