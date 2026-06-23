import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Colors, Fonts, FontSizes, Radii } from '@/constants/theme';

type Variant = 'default' | 'eucalyptus' | 'white';

const VALUE_COLORS: Record<Variant, string> = {
  default:    Colors.workSoft,
  eucalyptus: Colors.rest,
  white:      Colors.textHi,
};

interface Props {
  label: string;
  value: string;
  variant?: Variant;
  style?: ViewStyle;
}

export default function SummaryCard({ label, value, variant = 'default', style }: Props) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: VALUE_COLORS[variant] }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    paddingHorizontal: 16,
    paddingVertical: 19,
    gap: 10,
  },
  label: {
    fontSize: FontSizes.label,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Colors.textMuted,
  },
  value: {
    fontFamily: Fonts.condensedBold,
    fontSize: FontSizes.displaySm,
  },
});
