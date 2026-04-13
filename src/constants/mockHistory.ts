import { WorkoutRecord } from '@/store/historyStore';

// Mock activities matching the Figma design spec (home screen "Recent" section).
// Used as a fallback when the user has no real history yet.
function daysAgo(n: number): number {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(9, 0, 0, 0);
  return d.getTime();
}

// Compute how many days back the most recent weekday label should be.
// e.g. "last Monday" = most recent past Monday (not today even if today is Mon).
function daysBackToWeekday(target: number): number {
  const today = new Date().getDay();
  const diff = (today - target + 7) % 7;
  return diff === 0 ? 7 : diff;
}

export const MOCK_HISTORY: WorkoutRecord[] = [
  {
    id: 'mock-1',
    name: 'Tabata Classic',
    type: 'hiit',
    completedAt: daysAgo(0),
    durationSecs: 240,
    roundsCompleted: 8,
    kcalBurned: 210,
  },
  {
    id: 'mock-2',
    name: 'Sprint Intervals',
    type: 'running',
    completedAt: daysAgo(1),
    durationSecs: 960,
    roundsCompleted: 8,
    kcalBurned: 340,
  },
  {
    id: 'mock-3',
    name: '45/15 Grind',
    type: 'cardio',
    completedAt: daysAgo(daysBackToWeekday(1)), // Monday
    durationSecs: 600,
    roundsCompleted: 10,
    kcalBurned: 280,
  },
  {
    id: 'mock-4',
    name: 'Pyramid Builder',
    type: 'strength',
    completedAt: daysAgo(daysBackToWeekday(0)), // Sunday
    durationSecs: 540,
    roundsCompleted: 6,
    kcalBurned: 265,
  },
  {
    id: 'mock-5',
    name: 'Custom HIIT',
    type: 'hiit',
    completedAt: daysAgo(daysBackToWeekday(6)), // Saturday
    durationSecs: 720,
    roundsCompleted: 8,
    kcalBurned: 310,
  },
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function formatRelativeDate(ts: number): string {
  const now = new Date();
  const then = new Date(ts);
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(then)) / 86400000);
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return WEEKDAYS[then.getDay()];
  return then.toLocaleDateString();
}
