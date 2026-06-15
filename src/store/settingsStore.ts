import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage,persist } from 'zustand/middleware';

interface SettingsState {
  audioEnabled: boolean;
  voiceEnabled: boolean;
  setAudio: (v: boolean) => void;
  setVoice: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      audioEnabled: true,
      voiceEnabled: true,
      setAudio: (v) => set({ audioEnabled: v }),
      setVoice: (v) => set({ voiceEnabled: v }),
    }),
    {
      name: 'interval-fire-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
