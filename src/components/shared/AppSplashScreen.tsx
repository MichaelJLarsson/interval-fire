import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import FlameIcon from '@/components/shared/FlameIcon'
import { Colors } from '@/constants/theme'

interface Props {
  onLayout?: () => void
}

export default function AppSplashScreen({ onLayout }: Props) {
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.85)

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) })
    scale.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.2)) })
  }, [])

  const flameAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  return (
    <View style={styles.root} onLayout={onLayout}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        locations={[0, 0.35]}
        style={styles.gradient}
      >
        <Animated.View style={flameAnimatedStyle}>
          <FlameIcon size={140} />
        </Animated.View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  gradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})
