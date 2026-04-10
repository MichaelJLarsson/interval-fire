import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';

interface Props {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  value: string;
  valueColor: string;
  showDivider?: boolean;
  style?: ViewStyle;
}

export default function PersonalBestRow({
  icon, iconBg, title, subtitle, value, valueColor, showDivider = true, style,
}: Props) {
  return (
    <View style={[styles.row, showDivider && styles.divider, style]}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 12,
  },
  divider: {
    borderBottomWidth: 1.4,
    borderBottomColor: Colors.divider,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textHi,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textLo,
    marginTop: 1,
  },
  value: {
    fontFamily: Fonts.condensedBold,
    fontSize: 30,
    textAlign: 'right',
  },
});
