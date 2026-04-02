import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Radii } from '@/constants/theme';

interface Props {
  label: string;
  sublabel?: string;
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
  size?: 'large' | 'small';
}

export default function Stepper({ label, sublabel, value, onDecrement, onIncrement, size = 'large' }: Props) {
  const isLarge = size === 'large';
  return (
    <View style={[styles.row, isLarge && styles.rowLarge]}>
      <View style={styles.labelWrap}>
        <Text style={isLarge ? styles.labelLg : styles.labelSm}>{label}</Text>
        {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
      </View>
      <View style={styles.controls}>
        <Pressable style={styles.btn} onPress={onDecrement}>
          <Text style={styles.btnText}>−</Text>
        </Pressable>
        <Text style={[styles.value, isLarge && styles.valueLg]}>{value}</Text>
        <Pressable style={styles.btn} onPress={onIncrement}>
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceLo, borderRadius: Radii.lg, paddingHorizontal: 16, paddingVertical: 14 },
  rowLarge:  {},
  labelWrap: { flex: 1 },
  labelLg:   { fontSize: 15, fontWeight: '600', color: Colors.textMid },
  labelSm:   { fontSize: 13, fontWeight: '600', color: Colors.textMid },
  sublabel:  { fontSize: 12, color: Colors.textLo, marginTop: 3 },
  controls:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  btn:       { width: 36, height: 36, borderRadius: Radii.sm, backgroundColor: Colors.stepBg, borderWidth: 1.5, borderColor: Colors.stepBorder, alignItems: 'center', justifyContent: 'center' },
  btnText:   { fontSize: 20, fontWeight: '700', color: Colors.textHi },
  value:     { fontFamily: 'BarlowCondensed_700Bold', fontSize: 22, fontWeight: '700', minWidth: 54, textAlign: 'center', color: Colors.textHi },
  valueLg:   { fontSize: 26 },
});
