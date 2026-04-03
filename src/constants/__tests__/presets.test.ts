import { stepTime, stepWarmup, formatTime, totalSecs } from '../presets';
import type { Preset } from '../presets';

describe('stepTime', () => {
  describe('stepping up', () => {
    it('increments by 5s when below 60s', () => {
      expect(stepTime(20, 1)).toBe(25);
      expect(stepTime(55, 1)).toBe(60);
    });

    it('increments by 15s when at or above 60s', () => {
      expect(stepTime(60, 1)).toBe(75);
      expect(stepTime(75, 1)).toBe(90);
    });
  });

  describe('stepping down', () => {
    it('decrements by 5s when at or below 60s', () => {
      expect(stepTime(30, -1)).toBe(25);
      expect(stepTime(5, -1)).toBe(0);
    });

    it('clamps to 0 at the bottom', () => {
      expect(stepTime(0, -1)).toBe(0);
    });

    it('decrements by 15s when above 60s', () => {
      expect(stepTime(90, -1)).toBe(75);
    });

    it('clamps to 60s when step would go below 60s from above', () => {
      expect(stepTime(70, -1)).toBe(60);
    });
  });
});

describe('stepWarmup', () => {
  describe('stepping up', () => {
    it('increments by 30s when below 120s', () => {
      expect(stepWarmup(0, 1)).toBe(30);
      expect(stepWarmup(90, 1)).toBe(120);
    });

    it('increments by 60s when at or above 120s', () => {
      expect(stepWarmup(120, 1)).toBe(180);
      expect(stepWarmup(180, 1)).toBe(240);
    });
  });

  describe('stepping down', () => {
    it('decrements by 30s when at or below 120s', () => {
      expect(stepWarmup(120, -1)).toBe(90);
      expect(stepWarmup(30, -1)).toBe(0);
    });

    it('clamps to 0 at the bottom', () => {
      expect(stepWarmup(0, -1)).toBe(0);
    });

    it('decrements by 60s when above 120s', () => {
      expect(stepWarmup(180, -1)).toBe(120);
    });

    it('clamps to 120s when step would go below 120s from above', () => {
      expect(stepWarmup(150, -1)).toBe(120);
    });
  });
});

describe('formatTime', () => {
  it('returns "Off" for 0', () => {
    expect(formatTime(0)).toBe('Off');
  });

  it('returns seconds string for values under 60', () => {
    expect(formatTime(5)).toBe('5s');
    expect(formatTime(45)).toBe('45s');
    expect(formatTime(59)).toBe('59s');
  });

  it('returns M:00 for exact minutes', () => {
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(120)).toBe('2:00');
  });

  it('returns M:SS with zero-padded seconds', () => {
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(90)).toBe('1:30');
    expect(formatTime(125)).toBe('2:05');
  });
});

describe('totalSecs', () => {
  const base: Pick<Preset, 'workSecs' | 'restSecs' | 'rounds' | 'warmupSecs' | 'cooldownSecs'> = {
    workSecs: 20,
    restSecs: 10,
    rounds: 8,
    warmupSecs: 0,
    cooldownSecs: 0,
  };

  it('calculates rounds * (work + rest) with no warmup/cooldown', () => {
    expect(totalSecs(base)).toBe(8 * 30); // 240
  });

  it('includes warmup and cooldown', () => {
    expect(totalSecs({ ...base, warmupSecs: 60, cooldownSecs: 60 })).toBe(240 + 120);
  });

  it('handles zero rounds', () => {
    expect(totalSecs({ ...base, rounds: 0 })).toBe(0);
  });
});
