import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Polygon } from 'react-native-svg';

import PhasePill from '@/components/shared/PhasePill';
import { formatTime, Preset, TYPE_LABELS } from '@/constants/presets';
import { Colors, Fonts, FontSizes, Radii, Spacing } from '@/constants/theme';

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
  dragging: SharedValue<number>;
  onSelect: (preset: Preset) => void;
  onPlay: (preset: Preset) => void;
  onEdit: (preset: Preset) => void;
}

function usePressScale() {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const onPressIn = useCallback(() => {
    scale.value = withTiming(0.95, { duration: 100 });
  }, [scale]);
  const onPressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 100 });
  }, [scale]);
  return { animStyle, onPressIn, onPressOut };
}

function PresetCard({ item, active, dragging, onSelect, onPlay, onEdit }: PresetCardProps) {
  const progress = useSharedValue(active ? 1 : 0);
  const playPress = usePressScale();
  const editPress = usePressScale();

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 180 });
  }, [active, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const show = progress.value * (1 - dragging.value);
    return {
      borderColor: interpolateColor(
        show,
        [0, 1],
        ['rgba(255,61,61,0)', Colors.work]
      ),
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Pressable style={styles.cardInner} onPress={() => onSelect(item)}>
        {/* Top row: (type label + title) on left, play button on right */}
        <View style={styles.topRow}>
          <View style={styles.topLeft}>
            <Text style={styles.typeLabel}>{TYPE_LABELS[item.type]}</Text>
            <Text style={styles.name}>{item.name.toUpperCase()}</Text>
          </View>
          <Animated.View style={playPress.animStyle}>
            <Pressable
              style={styles.playBtn}
              onPress={() => onPlay(item)}
              onPressIn={playPress.onPressIn}
              onPressOut={playPress.onPressOut}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24">
                <Polygon points="8,5 20,12 8,19" fill={Colors.white} />
              </Svg>
            </Pressable>
          </Animated.View>
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

          <Animated.View style={editPress.animStyle}>
            <Pressable
              style={styles.editBtn}
              onPress={() => onEdit(item)}
              onPressIn={editPress.onPressIn}
              onPressOut={editPress.onPressOut}
            >
              <Text style={styles.editText}>EDIT</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const DOT_SIZE = 6;
const DOT_ACTIVE_W = 18;

function AnimatedDot({ index, scrollX }: { index: number; scrollX: SharedValue<number> }) {
  const snapInterval = CARD_W + CARD_GAP;

  const animStyle = useAnimatedStyle(() => {
    const progress = scrollX.value / snapInterval;
    const diff = Math.abs(progress - index);

    const width = interpolate(
      diff,
      [0, 1],
      [DOT_ACTIVE_W, DOT_SIZE],
      'clamp'
    );

    const backgroundColor = interpolateColor(
      diff,
      [0, 1],
      [Colors.work, Colors.divider]
    );

    return { width, backgroundColor };
  });

  return <Animated.View style={[styles.dot, animStyle]} />;
}

export default function PresetCarousel({ presets, selectedId, onSelect, onPlay, onEdit }: Props) {
  const flatRef = useRef<FlatList>(null);
  const cardScale = useSharedValue(1);
  const dragging = useSharedValue(0);
  const scrollX = useSharedValue(0);
  const lastSnappedIndex = useRef(0);

  const onScroll = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    scrollX.value = offsetX;
    const idx = Math.round(offsetX / (CARD_W + CARD_GAP));
    const clamped = Math.max(0, Math.min(presets.length - 1, idx));
    if (clamped !== lastSnappedIndex.current) {
      lastSnappedIndex.current = clamped;
      onSelect(presets[clamped]);
    }
  };

  const onScrollBeginDrag = () => {
    cardScale.value = withTiming(0.96, { duration: 150 });
    dragging.value = withTiming(1, { duration: 150 });
  };

  const onScrollEndDrag = () => {
    cardScale.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.quad) });
    dragging.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.quad) });
  };

  const onMomentumScrollEnd = () => {
    cardScale.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.quad) });
    dragging.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.quad) });
  };

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  return (
    <View>
      <Animated.View style={scaleStyle}>
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
          onScrollBeginDrag={onScrollBeginDrag}
          onScrollEndDrag={onScrollEndDrag}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <PresetCard
              item={item}
              active={item.id === selectedId}
              dragging={dragging}
              onSelect={onSelect}
              onPlay={onPlay}
              onEdit={onEdit}
            />
          )}
        />
      </Animated.View>
      {/* Dot indicator */}
      <View style={styles.dotRow}>
        {presets.map((_, i) => (
          <AnimatedDot key={i} index={i} scrollX={scrollX} />
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
    fontSize: FontSizes.label,
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
    fontSize: FontSizes.displayMd,
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
    fontSize: FontSizes.label,
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
    fontSize: FontSizes.body,
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
    height: 6,
    borderRadius: 3,
  },
});
