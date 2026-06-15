import React, { useRef } from 'react';
import { Animated,Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { Colors, Fonts, FontSizes, Radii } from '@/constants/theme';

interface Props {
  label: string;
  variant?: 'filled' | 'outline';
  icon?: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
}

export default function CTAButton({ label, variant = 'filled', icon, onPress, style }: Props) {
  const isFilled = variant === 'filled';
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        style={[styles.base, isFilled ? styles.filled : styles.outline]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {icon}
        <Text style={[styles.text, !isFilled && styles.textOutline]}>{label}</Text>
      </Pressable>
    </Animated.View>
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
    fontSize: FontSizes.headingMd,
    color: Colors.textHi,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  textOutline: {
    color: Colors.work,
  },
});
