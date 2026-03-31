import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Phase } from '@/store/workoutStore';

export function useHaptics() {
  const phaseHaptic = useCallback((phase: Phase | 'work' | 'rest' | 'finish') => {
    switch (phase) {
      case 'work':
        // Heavy impact — "GO!"
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'rest':
        // Medium impact — "breathe"
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'finish':
        // Notification success pattern
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const lightTap = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return { phaseHaptic, lightTap };
}
