import React, { useRef } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { Preset, TYPE_LABELS, formatTime } from '@/constants/presets';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - Spacing.screenH * 2;
const CARD_GAP = 12;

const TYPE_COLORS: Record<string, string> = {
  hiit:     Colors.workLight,
  running:  Colors.rest,
  cardio:   Colors.prep,
  strength: '#b388ff',
};

interface Props {
  presets: Preset[];
  selectedId: string;
  onSelect: (preset: Preset) => void;
}

export default function PresetCarousel({ presets, selectedId, onSelect }: Props) {
  const flatRef = useRef<FlatList>(null);
  const [activeDot, setActiveDot] = React.useState(0);

  const onScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (CARD_W + CARD_GAP));
    const clamped = Math.max(0, Math.min(presets.length - 1, idx));
    setActiveDot(clamped);
    onSelect(presets[clamped]);
  };

  return (
    <View>
      <FlatList
        ref={flatRef}
        data={presets}
        horizontal
        pagingEnabled={false}
        snapToInterval={CARD_W + CARD_GAP}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.screenH, gap: CARD_GAP }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => {
          const color = TYPE_COLORS[item.type];
          const isSelected = item.id === selectedId;
          return (
            <Pressable
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => onSelect(item)}
            >
              <Text style={[styles.typeLabel, { color }]}>{TYPE_LABELS[item.type]}</Text>
              <Text style={styles.name}>{item.name.replace(' ', '\n')}</Text>
              <View style={styles.tags}>
                <View style={styles.tagWork}><Text style={styles.tagWorkText}>{formatTime(item.workSecs)} work</Text></View>
                <View style={styles.tagRest}><Text style={styles.tagRestText}>{formatTime(item.restSecs)} rest</Text></View>
              </View>
              <View style={styles.pills}>
                <View style={styles.pill}><Text style={styles.pillText}>{item.rounds} rounds</Text></View>
                <View style={styles.pill}><Text style={styles.pillText}>{formatTime(item.rounds * (item.workSecs + item.restSecs))}</Text></View>
              </View>
            </Pressable>
          );
        }}
      />
      {/* Dot indicator */}
      <View style={styles.dotRow}>
        {presets.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeDot && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W, backgroundColor: Colors.surface,
    borderRadius: Radii.xl, padding: 20,
    borderWidth: 2, borderColor: Colors.border,
  },
  cardSelected: { borderColor: Colors.work },
  typeLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  name:      { fontFamily: 'BarlowCondensed_900Black', fontSize: 32, textTransform: 'uppercase', lineHeight: 32, color: Colors.textHi, marginBottom: 14 },
  tags:      { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 12 },
  tagWork:   { backgroundColor: '#ff3d3d28', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagWorkText: { fontSize: 11, fontWeight: '700', color: '#ff7070', textTransform: 'uppercase' },
  tagRest:   { backgroundColor: '#00e5a020', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagRestText: { fontSize: 11, fontWeight: '700', color: Colors.rest, textTransform: 'uppercase' },
  pills:     { flexDirection: 'row', gap: 8 },
  pill:      { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  pillText:  { fontSize: 11, color: Colors.textMuted },
  dotRow:    { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  dot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: '#333' },
  dotActive: { width: 18, borderRadius: 3, backgroundColor: Colors.work },
});
