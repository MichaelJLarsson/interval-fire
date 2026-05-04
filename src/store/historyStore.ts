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
  // Returns minutes per weekday, indexed Mon=0 … Sun=6, for records in the last 7 days.
  const result = new Array(7).fill(0);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  records.forEach((r) => {
    const rDate = new Date(r.completedAt);
    const rStart = new Date(rDate.getFullYear(), rDate.getMonth(), rDate.getDate()).getTime();
    const diffDays = Math.round((todayStart - rStart) / 86400000);
    if (diffDays >= 0 && diffDays < 7) {
      const idx = (rDate.getDay() + 6) % 7;
      result[idx] += Math.round(r.durationSecs / 60);
    }
  });
  return result;
}

const KCAL_TYPE_MULTIPLIER: Record<WorkoutType, number> = {
  hiit:     1.2,
  running:  1.15,
  cardio:   1.0,
  strength: 0.85,
};

export function estimateKcal(workSecs: number, rounds: number, type: WorkoutType = 'cardio'): number {
  return Math.round((rounds * workSecs * 0.15 + rounds * 2) * KCAL_TYPE_MULTIPLIER[type]);
}

// ─── Mock data ───────────────────────────────────────────────────────────────
function generateMockRecords(): WorkoutRecord[] {
  const now = new Date();

  const templates: { name: string; type: WorkoutType; durationSecs: number; rounds: number; kcal: number }[] = [
    { name: 'Tabata Blast',      type: 'hiit',     durationSecs: 1440, rounds: 12, kcal: 312 },
    { name: 'Morning Cardio',    type: 'cardio',   durationSecs: 1800, rounds: 8,  kcal: 245 },
    { name: 'Sprint Intervals',  type: 'running',  durationSecs: 2100, rounds: 10, kcal: 380 },
    { name: 'Power Circuit',     type: 'strength', durationSecs: 2400, rounds: 15, kcal: 420 },
    { name: 'Quick HIIT',        type: 'hiit',     durationSecs: 900,  rounds: 6,  kcal: 165 },
    { name: 'Endurance Run',     type: 'running',  durationSecs: 3000, rounds: 10, kcal: 490 },
    { name: 'Core Burner',       type: 'strength', durationSecs: 1200, rounds: 8,  kcal: 195 },
  ];

  const records: WorkoutRecord[] = [];

  // Generate workouts for 6 of the last 7 days (skip 4 days ago for variety)
  const daysAgoWithWorkouts = [0, 1, 2, 3, 5, 6];

  daysAgoWithWorkouts.forEach((daysAgo, i) => {
    const t = templates[i % templates.length];
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(7 + i, 30, 0, 0);
    records.push({
      id: `mock-${i}`,
      name: t.name,
      type: t.type,
      completedAt: date.getTime(),
      durationSecs: t.durationSecs,
      roundsCompleted: t.rounds,
      kcalBurned: t.kcal,
    });
  });

  const olderTemplates = [
    { name: 'Tabata Blast',     type: 'hiit' as WorkoutType,     durationSecs: 1380, rounds: 12, kcal: 298 },
    { name: 'Power Circuit',    type: 'strength' as WorkoutType, durationSecs: 2700, rounds: 18, kcal: 465 },
    { name: 'Sprint Intervals', type: 'running' as WorkoutType,  durationSecs: 2400, rounds: 10, kcal: 410 },
  ];

  for (let w = 1; w <= 3; w++) {
    olderTemplates.forEach((t, j) => {
      const date = new Date(now);
      date.setDate(date.getDate() - w * 7 - j);
      date.setHours(8, 0, 0, 0);
      records.push({
        id: `mock-old-${w}-${j}`,
        name: t.name,
        type: t.type,
        completedAt: date.getTime(),
        durationSecs: t.durationSecs,
        roundsCompleted: t.rounds,
        kcalBurned: t.kcal,
      });
    });
  }

  return records.sort((a, b) => b.completedAt - a.completedAt);
}

const MOCK_RECORDS = generateMockRecords();

// ─── Store ────────────────────────────────────────────────────────────────────
export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      records: MOCK_RECORDS,
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
