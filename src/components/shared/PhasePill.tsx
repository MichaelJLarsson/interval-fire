import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Colors, FontSizes, Radii } from '@/constants/theme';

interface Props {
  label: string;
  phase: 'work' | 'rest';
  style?: ViewStyle;
}

export default function PhasePill({ label, phase, style }: Props) {
  const isWork = phase === 'work';
  return (
    <View style={[styles.pill, isWork ? styles.work : styles.rest, style]}>
      <Text style={[styles.text, { color: isWork ? '#ff7070' : Colors.rest }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: Radii.sm,
    paddingHorizontal: 10,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  work: {
    backgroundColor: Colors.workBgTint2,
  },
  rest: {
    backgroundColor: Colors.restBgTint,
  },
  text: {
    fontSize: FontSizes.label,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
