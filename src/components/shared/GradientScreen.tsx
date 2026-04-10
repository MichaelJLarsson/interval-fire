import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function GradientScreen({ children, style }: Props) {
  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      locations={[0, 0.22]}
      style={styles.gradient}
    >
      <SafeAreaView style={[styles.safe, style]}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
});
