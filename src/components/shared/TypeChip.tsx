import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSizes, Radii } from '@/constants/theme';

interface Props {
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export default function TypeChip({ label, icon, selected = false, onPress, style }: Props) {
  return (
    <Pressable
      style={[styles.chip, selected ? styles.selected : styles.default, style]}
      onPress={onPress}
    >
      {icon}
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
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
  selected: {
    backgroundColor: Colors.workBgTint3,
    borderColor: Colors.work,
  },
  label: {
    fontSize: FontSizes.label,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: Colors.textHi,
  },
  labelSelected: {
    color: Colors.work,
  },
});
