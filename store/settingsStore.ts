import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  audioEnabled: boolean;
  voiceEnabled: boolean;
  warningEnabled: boolean;
  setAudio: (v: boolean) => void;
  setVoice: (v: boolean) => void;
  setWarning: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      audioEnabled:   true,
      voiceEnabled:   true,
      warningEnabled: true,
      setAudio:   (v) => set({ audioEnabled: v }),
      setVoice:   (v) => set({ voiceEnabled: v }),
      setWarning: (v) => set({ warningEnabled: v }),
    }),
    {
      name: 'interval-fire-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
