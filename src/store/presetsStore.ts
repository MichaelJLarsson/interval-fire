import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Preset, STARTER_PRESETS } from '@/constants/presets';

interface PresetsState {
  presets: Preset[];
  addPreset: (preset: Omit<Preset, 'id'>) => string;
  updatePreset: (id: string, patch: Partial<Omit<Preset, 'id'>>) => void;
  deletePreset: (id: string) => void;
}

function makeId(): string {
  return `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const usePresetsStore = create<PresetsState>()(
  persist(
    (set) => ({
      presets: STARTER_PRESETS,
      addPreset: (preset) => {
        const id = makeId();
        set((state) => ({ presets: [{ ...preset, id }, ...state.presets] }));
        return id;
      },
      updatePreset: (id, patch) =>
        set((state) => ({
          presets: state.presets.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      deletePreset: (id) =>
        set((state) => ({ presets: state.presets.filter((p) => p.id !== id) })),
    }),
    {
      name: 'interval-fire-presets',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
