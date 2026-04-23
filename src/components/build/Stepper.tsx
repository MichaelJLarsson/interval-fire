import { Colors, Fonts, FontSizes, Radii } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  label: string;
  sublabel?: string;
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
}

function StepperButton({ children, onPress }: { children: React.ReactNode; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={styles.btn}
        onPressIn={() => {
          scale.value = withTiming(0.85, { duration: 90, easing: Easing.out(Easing.ease) });
        }}
        onPressOut={() => {
          scale.value = withSequence(
            withTiming(1.1, { duration: 110, easing: Easing.out(Easing.ease) }),
            withTiming(1, { duration: 120, easing: Easing.out(Easing.ease) }),
          );
        }}
        onPress={onPress}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export default function Stepper({ label, sublabel, value, onDecrement, onIncrement }: Props) {
  const valueScale = useSharedValue(1);
  const previousValue = useRef(value);

  useEffect(() => {
    if (previousValue.current !== value) {
      previousValue.current = value;
      valueScale.value = withSequence(
        withTiming(1.18, { duration: 110, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 160, easing: Easing.out(Easing.ease) }),
      );
    }
  }, [value, valueScale]);

  const valueAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: valueScale.value }],
  }));

  return (
    <View style={styles.row}>
      <View style={styles.labelWrap}>
        <Text style={styles.label}>{label}</Text>
        {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
      </View>
      <View style={styles.controls}>
        <StepperButton onPress={onIncrement}>
          <Text style={styles.btnText}>+</Text>
        </StepperButton>
        <Animated.Text style={[styles.value, valueAnimatedStyle]}>{value}</Animated.Text>
        <StepperButton onPress={onDecrement}>
          <Text style={styles.btnText}>−</Text>
        </StepperButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.planeBlack,
    borderRadius: Radii.xl,
    paddingHorizontal: 18,
    paddingVertical: 16,
    height: 68,
  },
  labelWrap: { flex: 1 },
  label: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.textMid,
  },
  sublabel: {
    fontSize: FontSizes.caption,
    fontWeight: '500',
    color: Colors.textLo,
    marginTop: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: Radii.sm,
    backgroundColor: Colors.planeBlack,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: FontSizes.bodyXl,
    fontWeight: '700',
    color: Colors.textHi,
  },
  value: {
    fontFamily: Fonts.condensedBold,
    fontSize: FontSizes.headingMd,
    fontWeight: '700',
    minWidth: 44,
    textAlign: 'center',
    color: Colors.textHi,
  },
});
