import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';

interface Props {
  title: string;
  subtitle: string;
  value: string;
  unit?: string;
  showDivider?: boolean;
  style?: ViewStyle;
}

export default function HistoryRow({ title, subtitle, value, unit = 'kcal', showDivider = true, style }: Props) {
  return (
    <View style={[styles.row, showDivider && styles.divider, style]}>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.valueWrap}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  info: { flex: 1 },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMid,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textLo,
    marginTop: 1,
  },
  valueWrap: { alignItems: 'flex-end' },
  value: {
    fontFamily: Fonts.condensedBold,
    fontSize: 17,
    color: Colors.kcalValue,
    textAlign: 'right',
  },
  unit: {
    fontSize: 10,
    color: Colors.textKcal,
    textAlign: 'right',
  },
});
