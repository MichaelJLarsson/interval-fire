import { createAudioPlayer } from 'expo-audio';
import { useRef, useEffect, useCallback } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

type BeepType = 'high' | 'low' | 'finish';

export type VoicePhrase =
  | 'prep'
  | 'work'
  | 'rest'
  | 'last_round'
  | 'three'
  | 'two'
  | 'one'
  | 'complete';

const VOICE_ASSETS: Record<VoicePhrase, ReturnType<typeof require>> = {
  prep:       require('@/assets/voice/prep.mp3'),
  work:       require('@/assets/voice/work.mp3'),
  rest:       require('@/assets/voice/rest.mp3'),
  last_round: require('@/assets/voice/last_round.mp3'),
  three:      require('@/assets/voice/three.mp3'),
  two:        require('@/assets/voice/two.mp3'),
  one:        require('@/assets/voice/one.mp3'),
  complete:   require('@/assets/voice/complete.mp3'),
};

const COUNTDOWN_TICK = require('@/assets/sounds/countdown.wav');

export function useAudio() {
  const { audioEnabled, voiceEnabled } = useSettingsStore();
  const voicePlayerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  const tickPlayerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);

  useEffect(() => {
    return () => {
      voicePlayerRef.current?.remove();
      tickPlayerRef.current?.remove();
    };
  }, []);

  // TODO: bundle short WAV beep files in assets/sounds/ and play via expo-audio
  const playBeep = useCallback(async (_type: BeepType) => {
    if (!audioEnabled) return;
  }, [audioEnabled]);

  const playTick = useCallback(() => {
    if (!audioEnabled) return;
    tickPlayerRef.current?.remove();
    const player = createAudioPlayer(COUNTDOWN_TICK);
    player.play();
    tickPlayerRef.current = player;
  }, [audioEnabled]);

  const speak = useCallback((phrase: VoicePhrase) => {
    if (!voiceEnabled) return;
    voicePlayerRef.current?.remove();
    const player = createAudioPlayer(VOICE_ASSETS[phrase]);
    player.play();
    voicePlayerRef.current = player;
  }, [voiceEnabled]);

  return { playBeep, playTick, speak };
}
