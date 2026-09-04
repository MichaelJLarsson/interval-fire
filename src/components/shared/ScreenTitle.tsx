import React from 'react'
import { StyleSheet, Text, ViewStyle } from 'react-native'

import { Colors, Fonts, FontSizes } from '@/constants/theme'

interface Props {
  line1: string
  line2: string
  style?: ViewStyle
}

export default function ScreenTitle({ line1, line2, style }: Props) {
  return (
    <Text style={[styles.title, style]}>
      {line1}
      {'\n'}
      <Text style={styles.accent}>{line2}</Text>
    </Text>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.condensedBold,
    fontSize: FontSizes.headingLg,
    textTransform: 'uppercase',
    color: Colors.textHi,
    lineHeight: 28,
    letterSpacing: -0.52,
  },
  accent: {
    color: Colors.work,
  },
})
