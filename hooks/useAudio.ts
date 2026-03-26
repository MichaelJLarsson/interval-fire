import { useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useSettingsStore } from '@/store/settingsStore';

type BeepType = 'high' | 'low' | 'finish';

// Frequencies for each beep type
const BEEP_FREQS: Record<BeepType, number[]> = {
  high:   [880],
  low:    [440],
  finish: [1046, 1318, 1568], // ascending triad
};

export function useAudio() {
  const { audioEnabled, voiceEnabled } = useSettingsStore();
  // We keep Audio session initialised lazily
  const sessionReady = useRef(false);

  const ensureSession = useCallback(async () => {
    if (sessionReady.current) return;
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
    });
    sessionReady.current = true;
  }, []);

  const playBeep = useCallback(async (type: BeepType) => {
    if (!audioEnabled) return;
    await ensureSession();
    // Generate a short tone via AudioContext on web; on native use expo-av Sound
    // For now we use a placeholder — replace with generated PCM or bundled assets
    // TODO: bundle short WAV beep files in assets/sounds/ and load here
    try {
      const freqs = BEEP_FREQS[type];
      for (let i = 0; i < freqs.length; i++) {
        setTimeout(async () => {
          // Bundled sound file path: require(`@/assets/sounds/${type}-${i}.wav`)
          // const { sound } = await Audio.Sound.createAsync(require(...))
          // await sound.playAsync()
          // sound.setOnPlaybackStatusUpdate((s) => { if (s.didJustFinish) sound.unloadAsync() })
        }, i * 200);
      }
    } catch (e) {
      // Fail silently — audio is non-critical
    }
  }, [audioEnabled, ensureSession]);

  const speak = useCallback((text: string) => {
    if (!voiceEnabled) return;
    Speech.stop();
    Speech.speak(text, { rate: 1.1 });
  }, [voiceEnabled]);

  return { playBeep, speak };
}
