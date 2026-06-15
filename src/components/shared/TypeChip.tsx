import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

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
  const scale = useSharedValue(1);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const selectedColors = selected
    ? { backgroundColor: accentStyle.bg, borderColor: accentStyle.border }
    : { backgroundColor: Colors.planeBlack, borderColor: Colors.border };

  return (
    <Animated.View style={[{ flex: 1 }, scaleStyle]}>
      <Pressable
        onPressIn={() => { scale.value = withTiming(0.93, { duration: 100, easing: Easing.out(Easing.ease) }); }}
        onPressOut={() => { scale.value = withTiming(1, { duration: 120, easing: Easing.out(Easing.ease) }); }}
        onPress={onPress}
        style={[styles.chip, selectedColors, style]}
      >
        {icon ? (
          <AnimatedChipIcon selected={selected} accent={accent}>
            {icon}
          </AnimatedChipIcon>
        ) : null}
        <Text style={[styles.label, selected && { color: accentStyle.text }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 65,
    borderRadius: Radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  label: {
    fontSize: FontSizes.label,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: Colors.textHi,
  },
});
