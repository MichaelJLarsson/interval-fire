export type WorkoutType = 'hiit' | 'running' | 'cardio' | 'strength';

export interface Preset {
  id: string;
  name: string;
  type: WorkoutType;
  workSecs: number;
  restSecs: number;
  rounds: number;
  prepSecs: number;
  warmupSecs: number;
  cooldownSecs: number;
}

export const PRESETS: Preset[] = [
  {
    id: 'tabata',
    name: 'Tabata Classic',
    type: 'hiit',
    workSecs: 20,
    restSecs: 10,
    rounds: 8,
    prepSecs: 10,
    warmupSecs: 0,
    cooldownSecs: 0,
  },
  {
    id: 'sprint',
    name: 'Sprint Intervals',
    type: 'running',
    workSecs: 30,
    restSecs: 90,
    rounds: 8,
    prepSecs: 10,
    warmupSecs: 0,
    cooldownSecs: 0,
  },
  {
    id: 'grind',
    name: '45/15 Grind',
    type: 'cardio',
    workSecs: 45,
    restSecs: 15,
    rounds: 10,
    prepSecs: 10,
    warmupSecs: 0,
    cooldownSecs: 0,
  },
  {
    id: 'pyramid',
    name: 'Pyramid Builder',
    type: 'strength',
    workSecs: 60,
    restSecs: 30,
    rounds: 6,
    prepSecs: 10,
    warmupSecs: 0,
    cooldownSecs: 0,
  },
];

export const TYPE_LABELS: Record<WorkoutType, string> = {
  hiit:     'HIIT',
  running:  'Running',
  cardio:   'Cardio',
  strength: 'Strength',
};

// Smart time stepping: 5s increments up to 60s, then 15s beyond
export function stepTime(current: number, direction: 1 | -1): number {
  if (direction === 1) {
    return current < 60 ? current + 5 : current + 15;
  }
  if (current <= 0) return 0;
  if (current <= 60) return Math.max(0, current - 5);
  return current - 15 < 60 ? 60 : current - 15;
}

// Warm-up / cool-down stepping: 30s up to 2 min, then 60s
export function stepWarmup(current: number, direction: 1 | -1): number {
  if (direction === 1) {
    return current < 120 ? current + 30 : current + 60;
  }
  if (current <= 0) return 0;
  if (current <= 120) return Math.max(0, current - 30);
  return current - 60 < 120 ? 120 : current - 60;
}

// Format seconds for display
export function formatTime(secs: number): string {
  if (secs === 0) return 'Off';
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s === 0 ? `${m}:00` : `${m}:${String(s).padStart(2, '0')}`;
}

// Total workout duration in seconds
export function totalSecs(preset: Pick<Preset, 'workSecs' | 'restSecs' | 'rounds' | 'warmupSecs' | 'cooldownSecs'>): number {
  return preset.rounds * (preset.workSecs + preset.restSecs)
    + preset.warmupSecs
    + preset.cooldownSecs;
}
