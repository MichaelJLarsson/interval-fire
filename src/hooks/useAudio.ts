import { createAudioPlayer } from 'expo-audio';
import { useRef, useEffect, useCallback } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

type BeepType = 'high' | 'low' | 'finish';

export type VoicePhrase =
  | 'prep'
  | 'work'
  | 'rest'
  | 'halfway'
  | 'last_round'
  | 'three'
  | 'two'
  | 'one'
  | 'complete';

const VOICE_ASSETS: Record<VoicePhrase, ReturnType<typeof require>> = {
  prep:       require('@/assets/voice/prep.mp3'),
  work:       require('@/assets/voice/work.mp3'),
  rest:       require('@/assets/voice/rest.mp3'),
  halfway:    require('@/assets/voice/halfway.mp3'),
  last_round: require('@/assets/voice/last_round.mp3'),
  three:      require('@/assets/voice/three.mp3'),
  two:        require('@/assets/voice/two.mp3'),
  one:        require('@/assets/voice/one.mp3'),
  complete:   require('@/assets/voice/complete.mp3'),
};

export function useAudio() {
  const { audioEnabled, voiceEnabled } = useSettingsStore();
  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);

  useEffect(() => {
    return () => {
      playerRef.current?.remove();
    };
  }, []);

  // TODO: bundle short WAV beep files in assets/sounds/ and play via expo-audio
  const playBeep = useCallback(async (_type: BeepType) => {
    if (!audioEnabled) return;
  }, [audioEnabled]);

  const speak = useCallback((phrase: VoicePhrase) => {
    if (!voiceEnabled) return;
    playerRef.current?.remove();
    const player = createAudioPlayer(VOICE_ASSETS[phrase]);
    player.play();
    playerRef.current = player;
  }, [voiceEnabled]);

  return { playBeep, speak };
}
