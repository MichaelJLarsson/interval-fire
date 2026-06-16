import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

interface ConfettiProps {
  count?: number;
  speed?: number; // 1.0 is default, higher is faster
  duration?: number; // total duration in ms
}

const CONFETTI_COLORS = [
  Colors.work,
  Colors.rest,
  Colors.prep,
  Colors.strength,
  '#FFD700', // Gold
  '#FF69B4', // HotPink
  '#00BFFF', // DeepSkyBlue
  '#FFA500', // Orange
  '#32CD32', // LimeGreen
];

const ConfettiPiece = ({ 
  index, 
  speed, 
  baseDuration 
}: { 
  index: number; 
  speed: number; 
  baseDuration: number 
}) => {
  const progress = useSharedValue(0);
  
  // Random direction
  const angle = Math.random() * Math.PI * 2;
  // Speed now scales the distance directly, independent of duration
  const distance = (40 + Math.random() * 140) * speed;
  const rotation = Math.random() * 360;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const size = 6 + Math.random() * 6;
  
  // Duration now strictly scales the animation time
  const duration = baseDuration * (0.8 + Math.random() * 0.4);
  const delay = Math.random() * 200;

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.quad),
      })
    );
  }, [delay, duration, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const x = Math.cos(angle) * distance * progress.value;
    const y = Math.sin(angle) * distance * progress.value;
    
    // Gravity effect: as progress increases, the pieces fall down more
    // We scale gravity with distance/speed to keep it looking natural
    const gravity = progress.value * progress.value * (60 * (speed * 0.5 + 0.5));
    
    return {
      transform: [
        { translateX: x },
        { translateY: y + gravity },
        { rotate: `${rotation + progress.value * 720}deg` },
        { scale: interpolate(progress.value, [0, 0.1, 0.9, 1], [0, 1, 1, 0]) },
      ],
      opacity: interpolate(progress.value, [0, 0.8, 1], [1, 1, 0]),
      backgroundColor: color,
      width: size,
      height: size,
      borderRadius: index % 3 === 0 ? size / 2 : 2, // Mix of circles and squares
      marginLeft: -size / 2, // Center the piece
      marginTop: -size / 2,
    };
  });

  return <Animated.View style={[styles.piece, animatedStyle]} />;
};

export const ConfettiExplosion = ({ 
  count = 40, 
  speed = 1, 
  duration = 1000 
}: ConfettiProps) => {
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.emitter}>
        {[...Array(count)].map((_, i) => (
          <ConfettiPiece 
            key={i} 
            index={i} 
            speed={speed} 
            baseDuration={duration} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    zIndex: 10,
  },
  emitter: {
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  piece: {
    position: 'absolute',
  },
});
