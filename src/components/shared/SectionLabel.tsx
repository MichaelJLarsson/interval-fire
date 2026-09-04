import React from 'react'
import { StyleSheet, Text, TextStyle } from 'react-native'

import { Colors, FontSizes } from '@/constants/theme'

interface Props {
  children: string
  style?: TextStyle
}

export default function SectionLabel({ children, style }: Props) {
  return <Text style={[styles.label, style]}>{children}</Text>
}

const styles = StyleSheet.create({
  label: {
    fontSize: FontSizes.label,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Colors.textMuted,
  },
})
