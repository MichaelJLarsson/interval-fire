import { useState, useCallback } from 'react';
import type { WorkoutType } from '@/constants/presets';

export interface BuildState {
  name: string;
  type: WorkoutType;
  workSecs: number;
  restSecs: number;
  rounds: number;
  prepSecs: number;
  warmupSecs: number;
  cooldownSecs: number;
  audioCues: boolean;
  voiceAnnouncements: boolean;
  threeSecondWarning: boolean;
}

const DEFAULT: BuildState = {
  name: '',
  type: 'hiit',
  workSecs: 20,
  restSecs: 10,
  rounds: 8,
  prepSecs: 10,
  warmupSecs: 0,
  cooldownSecs: 0,
  audioCues: true,
  voiceAnnouncements: true,
  threeSecondWarning: true,
};

/**
 * Smart step functions matching prototype behaviour:
 * - workSecs/restSecs: 5s steps up to 60s, then 15s steps
 * - warmup/cooldown:   30s steps up to 2min, then 60s steps
 * - prepSecs:          5s steps
 */
function stepTime(current: number, dir: 1 | -1): number {
  if (dir === 1) return current < 60 ? current + 5 : current + 15;
  if (current <= 0) return 0;
  if (current <= 60) return Math.max(0, current - 5);
  return current - 15 < 60 ? 60 : current - 15;
}

function stepWarmup(current: number, dir: 1 | -1): number {
  if (dir === 1) return current < 120 ? current + 30 : current + 60;
  if (current <= 0) return 0;
  if (current <= 120) return Math.max(0, current - 30);
  return current - 60 < 120 ? 120 : current - 60;
}

export function useWorkoutBuilder(initial: Partial<BuildState> = {}) {
  const [state, setState] = useState<BuildState>({ ...DEFAULT, ...initial });

  const set = useCallback(<K extends keyof BuildState>(key: K, value: BuildState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
  }, []);

  const adjustWork = useCallback((dir: 1 | -1) =>
    setState((s) => ({ ...s, workSecs: Math.max(5, stepTime(s.workSecs, dir)) })), []);

  const adjustRest = useCallback((dir: 1 | -1) =>
    setState((s) => ({ ...s, restSecs: Math.max(0, stepTime(s.restSecs, dir)) })), []);

  const adjustRounds = useCallback((dir: 1 | -1) =>
    setState((s) => ({ ...s, rounds: Math.min(30, Math.max(1, s.rounds + dir)) })), []);

  const adjustPrep = useCallback((dir: 1 | -1) =>
    setState((s) => ({ ...s, prepSecs: Math.max(0, stepTime(s.prepSecs, dir)) })), []);

  const adjustWarmup = useCallback((dir: 1 | -1) =>
    setState((s) => ({ ...s, warmupSecs: Math.max(0, stepWarmup(s.warmupSecs, dir)) })), []);

  const adjustCooldown = useCallback((dir: 1 | -1) =>
    setState((s) => ({ ...s, cooldownSecs: Math.max(0, stepWarmup(s.cooldownSecs, dir)) })), []);

  /** Total duration in seconds including warmup + cooldown */
  const totalSecs =
    state.rounds * (state.workSecs + state.restSecs) +
    state.warmupSecs +
    state.cooldownSecs;

  /** Intervals-only duration (excludes warmup/cooldown) */
  const intervalSecs = state.rounds * (state.workSecs + state.restSecs);

  return {
    state,
    set,
    adjustWork,
    adjustRest,
    adjustRounds,
    adjustPrep,
    adjustWarmup,
    adjustCooldown,
    totalSecs,
    intervalSecs,
  };
}
