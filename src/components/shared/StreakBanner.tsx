import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSizes, Radii } from '@/constants/theme';

interface Props {
  streak: number;
  style?: ViewStyle;
}

export default function StreakBanner({ streak, style }: Props) {
  return (
    <View style={[styles.banner, style]}>
      <Text style={styles.text}>🔥 {streak}-day streak - keep it up!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.streakBanner,
    borderWidth: 1,
    borderColor: Colors.streakBorder,
    borderRadius: Radii.md,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: FontSizes.body,
    fontWeight: '500',
    color: Colors.work,
  },
});
