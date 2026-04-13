import PhasePill from '@/components/shared/PhasePill';
import { Preset, TYPE_LABELS, formatTime } from '@/constants/presets';
import { Colors, Fonts, Radii, Spacing } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Polygon } from 'react-native-svg';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - Spacing.screenH * 2;
const CARD_GAP = 12;

interface Props {
  presets: Preset[];
  selectedId: string;
  onSelect: (preset: Preset) => void;
  onPlay: (preset: Preset) => void;
  onEdit: (preset: Preset) => void;
}

interface PresetCardProps {
  item: Preset;
  active: boolean;
  onSelect: (preset: Preset) => void;
  onPlay: (preset: Preset) => void;
  onEdit: (preset: Preset) => void;
}

function PresetCard({ item, active, onSelect, onPlay, onEdit }: PresetCardProps) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 180 });
  }, [active, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(255,61,61,0)', Colors.work]
    ),
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Pressable style={styles.cardInner} onPress={() => onSelect(item)}>
        {/* Top row: (type label + title) on left, play button on right */}
        <View style={styles.topRow}>
          <View style={styles.topLeft}>
            <Text style={styles.typeLabel}>{TYPE_LABELS[item.type]}</Text>
            <Text style={styles.name}>{item.name.toUpperCase()}</Text>
          </View>
          <Pressable style={styles.playBtn} onPress={() => onPlay(item)}>
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Polygon points="8,5 20,12 8,19" fill={Colors.white} />
            </Svg>
          </Pressable>
        </View>

        {/* Bottom area: pills left, edit right */}
        <View style={styles.bottomRow}>
          <View style={styles.pillsWrap}>
            {/* Phase pills */}
            <View style={styles.pillRow}>
              <PhasePill label={`${formatTime(item.workSecs)} work`} phase="work" />
              <PhasePill label={`${formatTime(item.restSecs)} rest`} phase="rest" />
            </View>
            {/* Meta chips */}
            <View style={styles.pillRow}>
              <View style={styles.metaChip}>
                <Text style={styles.metaText}>{item.rounds} rounds</Text>
              </View>
              <View style={styles.metaChip}>
                <Text style={styles.metaText}>{formatTime(item.rounds * (item.workSecs + item.restSecs))} min</Text>
              </View>
            </View>
          </View>

          <Pressable style={styles.editBtn} onPress={() => onEdit(item)}>
            <Text style={styles.editText}>EDIT</Text>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function PresetCarousel({ presets, selectedId, onSelect, onPlay, onEdit }: Props) {
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
        renderItem={({ item }) => (
          <PresetCard
            item={item}
            active={item.id === selectedId}
            onSelect={onSelect}
            onPlay={onPlay}
            onEdit={onEdit}
          />
        )}
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
    width: CARD_W,
    minHeight: 187,
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: 16,
    paddingTop: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardInner: {
    flex: 1,
    justifyContent: 'space-between',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  topLeft: {
    flex: 1,
    paddingRight: 12,
  },
  typeLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Colors.workLight,
  },
  playBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.work,
    alignItems: 'center',
    justifyContent: 'center',
  },

  name: {
    fontFamily: Fonts.condensed,
    fontSize: 36,
    textTransform: 'uppercase',
    lineHeight: 36,
    color: Colors.textHi,
    marginTop: 2,
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  pillsWrap: {
    gap: 6,
    flex: 1,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 6,
  },

  metaChip: {
    backgroundColor: Colors.metaChip,
    borderRadius: Radii.sm,
    paddingHorizontal: 10,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textLo,
  },

  editBtn: {
    backgroundColor: Colors.workBgButton,
    borderRadius: 7,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editText: {
    fontFamily: Fonts.condensedMedium,
    fontSize: 13,
    color: Colors.work,
    letterSpacing: 0.26,
  },

  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.divider,
  },
  dotActive: {
    width: 18,
    borderRadius: 3,
    backgroundColor: Colors.work,
  },
});
