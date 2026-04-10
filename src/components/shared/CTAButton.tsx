import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Fonts, Radii } from '@/constants/theme';

interface Props {
  label: string;
  variant?: 'filled' | 'outline';
  icon?: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
}

export default function CTAButton({ label, variant = 'filled', icon, onPress, style }: Props) {
  const isFilled = variant === 'filled';
  return (
    <Pressable
      style={[
        styles.base,
        isFilled ? styles.filled : styles.outline,
        style,
      ]}
      onPress={onPress}
    >
      {icon}
      <Text style={[styles.text, !isFilled && styles.textOutline]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderRadius: Radii.xl,
    paddingHorizontal: 31,
    paddingTop: 16,
    paddingBottom: 17,
  },
  filled: {
    backgroundColor: Colors.work,
  },
  outline: {
    backgroundColor: Colors.offBlack,
    borderWidth: 1,
    borderColor: Colors.work,
  },
  text: {
    fontFamily: Fonts.condensed,
    fontSize: 20,
    color: Colors.textHi,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  textOutline: {
    color: Colors.work,
  },
});
