import { Colors, Spacing } from '@/constants/theme'
import React, { useEffect } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface Props {
  label: string
  on: boolean
  onPress: () => void
  height?: number
}

export default function Toggle({ label, on, onPress, height = 24 }: Props) {
  const padding = Math.round(height / 9)
  const width = Math.round(height * (32 / 18))
  const thumbSize = height - padding * 2 - 1
  const thumbTravel = width - padding * 2 - thumbSize
  const fontSize = Math.round(height * (10 / 18))

  const v = useSharedValue(on ? 1 : 0)
  useEffect(() => {
    v.value = withTiming(on ? 1 : 0, { duration: 220, easing: Easing.out(Easing.cubic) })
  }, [on, v])

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(v.value, [0, 1], [Colors.borderHi, Colors.work]),
  }))

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: v.value * thumbTravel }],
    backgroundColor: interpolateColor(v.value, [0, 1], [Colors.textFaint, Colors.white]),
  }))

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Animated.View
        style={[
          {
            width,
            height,
            borderRadius: height / 2,
            justifyContent: 'center',
            paddingHorizontal: padding,
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[{ width: thumbSize, height: thumbSize, borderRadius: thumbSize / 2 }, thumbStyle]}
        />
      </Animated.View>
      <Text style={[styles.label, { fontSize }]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  label: {
    fontWeight: '700',
    color: Colors.textLo,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
})
