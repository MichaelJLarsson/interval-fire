import React from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'

import { Colors, FontSizes, Radii } from '@/constants/theme'

interface Props {
  label: string
  style?: ViewStyle
}

export default function StreakPill({ label, style }: Props) {
  return (
    <View style={[styles.pill, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: Colors.workBgTint,
    borderWidth: 1,
    borderColor: Colors.workSubtle,
    borderRadius: Radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: FontSizes.label,
    fontWeight: '700',
    color: '#ff6a6a',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
})
