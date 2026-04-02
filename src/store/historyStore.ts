import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutType } from '@/constants/presets';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface WorkoutRecord {
  id: string;
  name: string;
  type: WorkoutType;
  completedAt: number;   // Unix timestamp
  durationSecs: number;
  roundsCompleted: number;
  kcalBurned: number;
}

interface HistoryState {
  records: WorkoutRecord[];
  addRecord: (record: WorkoutRecord) => void;
  clearHistory: () => void;
}

// ─── Derived selectors (call outside the store to keep it lean) ───────────────
export function computeStreak(records: WorkoutRecord[]): number {
  if (records.length === 0) return 0;
  const days = new Set(
    records.map((r) => {
      const d = new Date(r.completedAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i <= 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (days.has(key)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export function weeklyMinutes(records: WorkoutRecord[]): number[] {
  // Returns [Mon, Tue, Wed, Thu, Fri, Sat, Sun] in minutes
  const result = new Array(7).fill(0);
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // Mon=0 … Sun=6
  records.forEach((r) => {
    const d = new Date(r.completedAt);
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays < 7) {
      const idx = (dayOfWeek - diffDays + 7) % 7;
      result[idx] += Math.round(r.durationSecs / 60);
    }
  });
  return result;
}

export function estimateKcal(workSecs: number, rounds: number): number {
  return Math.round(rounds * workSecs * 0.15 + rounds * 2);
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (record) =>
        set((state) => ({ records: [record, ...state.records] })),
      clearHistory: () => set({ records: [] }),
    }),
    {
      name: 'interval-fire-history',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
