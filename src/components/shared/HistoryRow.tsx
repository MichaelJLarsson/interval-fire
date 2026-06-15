import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Colors, Fonts, FontSizes } from '@/constants/theme';

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
    paddingVertical: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  info: { flex: 1 },
  title: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSizes.body,
    color: Colors.textMid,
  },
  subtitle: {
    fontSize: FontSizes.caption,
    fontWeight: '500',
    color: Colors.textLo,
    marginTop: 2,
  },
  valueWrap: { alignItems: 'flex-end' },
  value: {
    fontFamily: Fonts.condensedBold,
    fontSize: FontSizes.bodyXl,
    color: Colors.kcalValue,
    textAlign: 'right',
  },
  unit: {
    fontSize: FontSizes.caption,
    fontWeight: '500',
    color: Colors.textLo,
    textAlign: 'right',
    marginTop: 2,
  },
});
