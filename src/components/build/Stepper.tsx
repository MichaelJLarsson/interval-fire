import { Colors, Fonts, FontSizes, Radii } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  label: string;
  sublabel?: string;
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
}

export default function Stepper({ label, sublabel, value, onDecrement, onIncrement }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.labelWrap}>
        <Text style={styles.label}>{label}</Text>
        {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
      </View>
      <View style={styles.controls}>
        <Pressable style={styles.btn} onPress={onIncrement}>
          <Text style={styles.btnText}>+</Text>
        </Pressable>
        <Text style={styles.value}>{value}</Text>
        <Pressable style={styles.btn} onPress={onDecrement}>
          <Text style={styles.btnText}>−</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.planeBlack,
    borderRadius: Radii.xl,
    paddingHorizontal: 18,
    paddingVertical: 16,
    height: 68,
  },
  labelWrap: { flex: 1 },
  label: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.textMid,
  },
  sublabel: {
    fontSize: FontSizes.caption,
    fontWeight: '500',
    color: Colors.textLo,
    marginTop: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: Radii.sm,
    backgroundColor: Colors.planeBlack,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: FontSizes.bodyXl,
    fontWeight: '700',
    color: Colors.textHi,
  },
  value: {
    fontFamily: Fonts.condensedBold,
    fontSize: FontSizes.headingMd,
    fontWeight: '700',
    minWidth: 44,
    textAlign: 'center',
    color: Colors.textHi,
  },
});
