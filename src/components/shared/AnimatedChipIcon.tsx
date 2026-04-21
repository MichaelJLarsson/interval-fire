import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { ChipAccent } from './TypeChip';

type Props = {
  selected: boolean;
  accent: ChipAccent;
  children: React.ReactNode;
};

/**
 * Wraps a chip icon and plays a one-shot animation when `selected` flips to true.
 *
 * - work  (raindrop): drops in from above
 * - prep  (running):  horizontal jog then settle
 * - rest  (heart):    heartbeat scale pulse
 * - strength (dumbbell): spring drop from above
 */
export default function AnimatedChipIcon({ selected, accent, children }: Props) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!selected) {
      // Reset instantly when deselected
      translateY.value = 0;
      translateX.value = 0;
      scale.value = 1;
      return;
    }

    switch (accent) {
      case 'work':
        // Raindrop drops in from the top
        translateY.value = -14;
        translateY.value = withTiming(0, { duration: 540, easing: Easing.out(Easing.cubic) });
        break;

      case 'prep':
        // Running man slides in from the left with a rubber band overshoot
        translateX.value = -14;
        translateX.value = withSpring(0, { damping: 9, stiffness: 200, mass: 0.6 });
        break;

      case 'rest':
        // Heartbeat: two quick pumps then settle
        scale.value = withSequence(
          withTiming(1.25, { duration: 120, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 100, easing: Easing.inOut(Easing.ease) }),
          withDelay(
            60,
            withTiming(1.2, { duration: 110, easing: Easing.out(Easing.ease) }),
          ),
          withTiming(1, { duration: 140, easing: Easing.inOut(Easing.ease) }),
        );
        break;

      case 'strength':
        // Dumbbell drops from top with a springy bounce
        translateY.value = -16;
        translateY.value = withSpring(0, { damping: 6, stiffness: 200, mass: 0.8 });
        break;
    }
  }, [selected, accent, translateY, translateX, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return <Animated.View style={animStyle}>{children}</Animated.View>;
}
