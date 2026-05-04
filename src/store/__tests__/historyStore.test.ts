import { computeStreak, estimateKcal, weeklyMinutes } from '../historyStore';
import type { WorkoutRecord } from '../historyStore';

// Fix "today" to a known date: 2026-04-03 (Friday)
const FIXED_NOW = new Date('2026-04-03T12:00:00.000Z').getTime();

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(FIXED_NOW);
});

afterEach(() => {
  jest.useRealTimers();
});

function makeRecord(overrides: Partial<WorkoutRecord> = {}): WorkoutRecord {
  return {
    id: Math.random().toString(36),
    name: 'Test',
    type: 'hiit',
    completedAt: FIXED_NOW,
    durationSecs: 300,
    roundsCompleted: 8,
    kcalBurned: 40,
    ...overrides,
  };
}

const DAY = 86400000;

describe('computeStreak', () => {
  it('returns 0 for empty records', () => {
    expect(computeStreak([])).toBe(0);
  });

  it('returns 1 for a single record today', () => {
    expect(computeStreak([makeRecord({ completedAt: FIXED_NOW })])).toBe(1);
  });

  it('returns 1 for a single record yesterday (today has no workout)', () => {
    expect(computeStreak([makeRecord({ completedAt: FIXED_NOW - DAY })])).toBe(1);
  });

  it('counts consecutive days including today', () => {
    const records = [
      makeRecord({ completedAt: FIXED_NOW }),
      makeRecord({ completedAt: FIXED_NOW - DAY }),
      makeRecord({ completedAt: FIXED_NOW - DAY * 2 }),
    ];
    expect(computeStreak(records)).toBe(3);
  });

  it('stops counting at a gap', () => {
    const records = [
      makeRecord({ completedAt: FIXED_NOW }),
      // skip yesterday
      makeRecord({ completedAt: FIXED_NOW - DAY * 2 }),
    ];
    expect(computeStreak(records)).toBe(1);
  });

  it('deduplicates multiple workouts on the same day', () => {
    const records = [
      makeRecord({ completedAt: FIXED_NOW }),
      makeRecord({ completedAt: FIXED_NOW + 3600000 }), // same day, 1h later
      makeRecord({ completedAt: FIXED_NOW - DAY }),
    ];
    expect(computeStreak(records)).toBe(2);
  });
});

describe('estimateKcal', () => {
  it('defaults to cardio multiplier (1.0)', () => {
    expect(estimateKcal(20, 8)).toBe(Math.round(8 * 20 * 0.15 + 8 * 2)); // 40
  });

  it('applies hiit multiplier (1.2)', () => {
    expect(estimateKcal(20, 8, 'hiit')).toBe(Math.round((8 * 20 * 0.15 + 8 * 2) * 1.2)); // 48
  });

  it('applies running multiplier (1.15)', () => {
    expect(estimateKcal(20, 8, 'running')).toBe(Math.round((8 * 20 * 0.15 + 8 * 2) * 1.15)); // 46
  });

  it('applies strength multiplier (0.85)', () => {
    expect(estimateKcal(20, 8, 'strength')).toBe(Math.round((8 * 20 * 0.15 + 8 * 2) * 0.85)); // 34
  });

  it('returns 0 for 0 rounds', () => {
    expect(estimateKcal(20, 0, 'hiit')).toBe(0);
  });

  it('returns rounds * 2 * multiplier for 0 workSecs', () => {
    expect(estimateKcal(0, 8, 'cardio')).toBe(Math.round(8 * 2)); // 16
  });
});

describe('weeklyMinutes', () => {
  it('returns a 7-element array of zeros for empty records', () => {
    const result = weeklyMinutes([]);
    expect(result).toHaveLength(7);
    expect(result.every((v) => v === 0)).toBe(true);
  });

  it('accumulates duration for a record today', () => {
    // FIXED_NOW is 2026-04-03 (Friday). In Mon=0 scheme: Friday = 4.
    const now = new Date(FIXED_NOW);
    const fridayIdx = (now.getDay() + 6) % 7; // (5 + 6) % 7 = 4

    const record = makeRecord({ completedAt: FIXED_NOW, durationSecs: 600 });
    const result = weeklyMinutes([record]);
    expect(result[fridayIdx]).toBe(10); // 600s = 10min
  });

  it('ignores records older than 7 days', () => {
    const oldRecord = makeRecord({ completedAt: FIXED_NOW - DAY * 8 });
    const result = weeklyMinutes([oldRecord]);
    expect(result.every((v) => v === 0)).toBe(true);
  });

  it('places records in the correct day bucket', () => {
    const now = new Date(FIXED_NOW);
    const fridayIdx = (now.getDay() + 6) % 7; // 4
    const thursdayIdx = (fridayIdx - 1 + 7) % 7; // 3

    const records = [
      makeRecord({ completedAt: FIXED_NOW, durationSecs: 300 }),           // Friday: 5 min
      makeRecord({ completedAt: FIXED_NOW - DAY, durationSecs: 600 }),     // Thursday: 10 min
    ];
    const result = weeklyMinutes(records);
    expect(result[fridayIdx]).toBe(5);
    expect(result[thursdayIdx]).toBe(10);
  });
});
