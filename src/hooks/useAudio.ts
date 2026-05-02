import { useSettingsStore } from '@/store/settingsStore';
import * as Speech from 'expo-speech';
import { useCallback } from 'react';

type BeepType = 'high' | 'low' | 'finish';

export function useAudio() {
  const { audioEnabled, voiceEnabled } = useSettingsStore();

  // TODO: bundle short WAV beep files in assets/sounds/ and play via expo-audio
  const playBeep = useCallback(async (_type: BeepType) => {
    if (!audioEnabled) return;
  }, [audioEnabled]);

  const speak = useCallback((text: string) => {
    if (!voiceEnabled) return;
    Speech.stop();
    Speech.speak(text, { rate: 1.1 });
  }, [voiceEnabled]);

  return { playBeep, speak };
}
