import { create } from 'zustand';
import { Preset } from '@/constants/presets';

// ─── Types ────────────────────────────────────────────────────────────────────
export type Phase = 'prep' | 'work' | 'rest';

export interface ActiveWorkout {
  preset: Preset;
  phase: Phase;
  round: number;          // 0 during prep, 1-based during intervals
  secondsLeft: number;
  totalSecsInPhase: number;
  startTimestamp: number; // Date.now() at workout start — for elapsed time
  isPaused: boolean;
}

interface WorkoutState {
  active: ActiveWorkout | null;
  // Actions
  startWorkout: (preset: Preset) => void;
  setPhase: (phase: Phase, secondsLeft: number, totalSecs: number, round?: number) => void;
  tick: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  active: null,

  startWorkout: (preset) =>
    set({
      active: {
        preset,
        phase: 'prep',
        round: 0,
        secondsLeft: preset.prepSecs || 10,
        totalSecsInPhase: preset.prepSecs || 10,
        startTimestamp: Date.now(),
        isPaused: false,
      },
    }),

  setPhase: (phase, secondsLeft, totalSecs, round) =>
    set((state) => ({
      active: state.active
        ? {
            ...state.active,
            phase,
            secondsLeft,
            totalSecsInPhase: totalSecs,
            round: round ?? state.active.round,
            isPaused: false,
          }
        : null,
    })),

  tick: () =>
    set((state) => {
      if (!state.active || state.active.isPaused) return state;
      return {
        active: {
          ...state.active,
          secondsLeft: Math.max(0, state.active.secondsLeft - 1),
        },
      };
    }),

  pause: () =>
    set((state) => ({
      active: state.active ? { ...state.active, isPaused: true } : null,
    })),

  resume: () =>
    set((state) => ({
      active: state.active ? { ...state.active, isPaused: false } : null,
    })),

  stop: () => set({ active: null }),
}));
