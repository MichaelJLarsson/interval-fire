import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface SettingsState {
  audioEnabled: boolean
  voiceEnabled: boolean
  syncToAppleHealth: boolean
  setAudio: (v: boolean) => void
  setVoice: (v: boolean) => void
  setSyncToAppleHealth: (v: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      audioEnabled: true,
      voiceEnabled: true,
      syncToAppleHealth: false,
      setAudio: (v) => set({ audioEnabled: v }),
      setVoice: (v) => set({ voiceEnabled: v }),
      setSyncToAppleHealth: (v) => set({ syncToAppleHealth: v }),
    }),
    {
      name: 'interval-fire-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
