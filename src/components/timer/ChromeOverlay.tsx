import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle, withTiming, Easing,
} from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/theme';

interface Props {
  visible: boolean;
  workoutName: string;
  phaseBadge: string;
  phaseColor: string;
  roundLabel: string;
  dots: { done: boolean; current: boolean }[];
  audioOn: boolean;
  voiceOn: boolean;
  onToggleAudio: () => void;
  onToggleVoice: () => void;
  onStop: () => void;
  onPauseResume: () => void;
  onSkip: () => void;
  isPaused: boolean;
}

const SPRING = { duration: 420, easing: Easing.out(Easing.back(1.15)) } as const;
const FADE   = { duration: 350 } as const;

export default function ChromeOverlay({
  visible, workoutName, phaseBadge, phaseColor, roundLabel,
  dots, audioOn, voiceOn,
  onToggleAudio, onToggleVoice,
  onStop, onPauseResume, onSkip, isPaused,
}: Props) {

  // Header slides down from top
  const headStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(visible ? 0 : -90, SPRING) }],
    opacity: withTiming(visible ? 1 : 0, FADE),
  }));

  // Dots + round slide down, slight delay
  const midStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(visible ? 0 : -60, SPRING) }],
    opacity: withTiming(visible ? 1 : 0, { duration: 300 }),
  }));

  // Controls slide up from bottom
  const footStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(visible ? 0 : 140, SPRING) }],
    opacity: withTiming(visible ? 1 : 0, FADE),
  }));

  // Toggles slide up slightly after controls
  const togStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(visible ? 0 : 140, SPRING) }],
    opacity: withTiming(visible ? 1 : 0, { duration: 350, easing: Easing.out(Easing.ease) }),
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">

      {/* ── Header ── */}
      <Animated.View style={[styles.head, headStyle]} pointerEvents={visible ? 'auto' : 'none'}>
        <View style={styles.headLeft}>
          <Text style={styles.workoutName}>{workoutName}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: phaseColor + '28' }]}>
          <Text style={[styles.badgeText, { color: phaseColor }]}>{phaseBadge}</Text>
        </View>
      </Animated.View>

      {/* ── Progress dots + round label ── */}
      <Animated.View style={[styles.mid, midStyle]} pointerEvents="none">
        <View style={styles.dots}>
          {dots.map((d, i) => (
            <View key={i} style={[
              styles.dot,
              d.done    && styles.dotDone,
              d.current && styles.dotCurrent,
            ]} />
          ))}
        </View>
        <Text style={styles.roundLabel}>{roundLabel}</Text>
      </Animated.View>

      {/* ── Controls ── */}
      <Animated.View style={[styles.foot, footStyle]} pointerEvents={visible ? 'auto' : 'none'}>
        <View style={styles.controls}>
          <Pressable style={styles.btnSm} onPress={onStop}>
            <Text style={styles.btnSmIcon}>■</Text>
          </Pressable>
          <Pressable style={[styles.btnLg, isPaused && styles.btnLgPaused]} onPress={onPauseResume}>
            <Text style={styles.btnLgIcon}>{isPaused ? '▶' : '⏸'}</Text>
          </Pressable>
          <Pressable style={styles.btnSm} onPress={onSkip}>
            <Text style={styles.btnSmIcon}>⏭</Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* ── Audio toggles ── */}
      <Animated.View style={[styles.toggles, togStyle]} pointerEvents={visible ? 'auto' : 'none'}>
        <Pressable style={styles.toggle} onPress={onToggleAudio}>
          <View style={[styles.sw, audioOn && styles.swOn]}>
            <View style={[styles.thumb, audioOn && styles.thumbOn]} />
          </View>
          <Text style={[styles.toggleLabel, audioOn && styles.toggleLabelOn]}>Audio</Text>
        </Pressable>
        <Pressable style={styles.toggle} onPress={onToggleVoice}>
          <View style={[styles.sw, voiceOn && styles.swOn]}>
            <View style={[styles.thumb, voiceOn && styles.thumbOn]} />
          </View>
          <Text style={[styles.toggleLabel, voiceOn && styles.toggleLabelOn]}>Voice</Text>
        </Pressable>
      </Animated.View>

      {/* ── Ghost hint pill (always visible) ── */}
      {!visible && (
        <View style={styles.hint}>
          <View style={styles.hintPill} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    position: 'absolute', top: 0, left: 0, right: 0,
    paddingTop: 52, paddingHorizontal: Spacing.screenH,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headLeft:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  workoutName: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  badge:       { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  badgeText:   { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },

  mid: {
    position: 'absolute', top: 108, left: 0, right: 0,
  },
  dots:       { flexDirection: 'row', gap: 3, paddingHorizontal: Spacing.screenH },
  dot:        { flex: 1, height: 3, borderRadius: 3, backgroundColor: '#242424' },
  dotDone:    { backgroundColor: '#444' },
  dotCurrent: { backgroundColor: Colors.work },
  roundLabel: { textAlign: 'center', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: Colors.textMuted, marginTop: 8 },

  foot: {
    position: 'absolute', bottom: 52, left: 0, right: 0,
  },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, paddingHorizontal: Spacing.screenH, paddingVertical: 16 },
  btnSm:     { width: 56, height: 56, borderRadius: 28, backgroundColor: '#303030', borderWidth: 2, borderColor: '#555', alignItems: 'center', justifyContent: 'center' },
  btnSmIcon: { color: Colors.textHi, fontSize: 16 },
  btnLg:     { width: 76, height: 76, borderRadius: 38, backgroundColor: Colors.work, alignItems: 'center', justifyContent: 'center' },
  btnLgPaused: { backgroundColor: '#555' },
  btnLgIcon: { color: Colors.white, fontSize: 22 },

  toggles: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', gap: 28, paddingBottom: 20, paddingTop: 8,
  },
  toggle:          { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sw:              { width: 32, height: 18, borderRadius: 9, backgroundColor: '#2c2c2c', justifyContent: 'center', paddingHorizontal: 2 },
  swOn:            { backgroundColor: Colors.work },
  thumb:           { width: 13, height: 13, borderRadius: 7, backgroundColor: '#555' },
  thumbOn:         { backgroundColor: Colors.white, alignSelf: 'flex-end' },
  toggleLabel:     { fontSize: 11, fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: 0.8 },
  toggleLabelOn:   { color: Colors.textMuted },

  hint: { position: 'absolute', bottom: 14, left: 0, right: 0, alignItems: 'center' },
  hintPill: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.13)' },
});
