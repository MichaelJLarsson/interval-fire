import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSequence, runOnJS,
} from 'react-native-reanimated';
import { Phase } from '@/store/workoutStore';

const PHASE_FLASH: Record<Phase | 'finish', string> = {
  work:   'rgba(255, 61,  61,  0.45)',
  rest:   'rgba(0,   229, 160, 0.35)',
  prep:   'rgba(255, 195, 0,   0.35)',
  finish: 'rgba(0,   229, 160, 0.55)',
};

interface Props {
  phase: Phase | 'finish' | null;
}

export default function FlashOverlay({ phase }: Props) {
  const opacity = useSharedValue(0);
  const bg = useSharedValue(PHASE_FLASH.work);

  useEffect(() => {
    if (!phase) return;
    bg.value = PHASE_FLASH[phase];
    opacity.value = withSequence(
      withTiming(1,  { duration: 80 }),
      withTiming(0,  { duration: 600 })
    );
  }, [phase]);

  const style = useAnimatedStyle(() => ({
    backgroundColor: bg.value,
    opacity: opacity.value,
  }));

  return <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, style]} pointerEvents="none" />;
}

const styles = StyleSheet.create({
  overlay: { zIndex: 10 },
});
