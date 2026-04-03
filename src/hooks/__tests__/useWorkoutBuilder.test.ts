import { renderHook, act } from '@testing-library/react-native';
import { useWorkoutBuilder } from '../useWorkoutBuilder';

describe('useWorkoutBuilder', () => {
  describe('initial state', () => {
    it('uses defaults when called with no arguments', () => {
      const { result } = renderHook(() => useWorkoutBuilder());
      expect(result.current.state.workSecs).toBe(20);
      expect(result.current.state.restSecs).toBe(10);
      expect(result.current.state.rounds).toBe(8);
      expect(result.current.state.prepSecs).toBe(10);
      expect(result.current.state.warmupSecs).toBe(0);
      expect(result.current.state.cooldownSecs).toBe(0);
    });

    it('merges provided initial values over defaults', () => {
      const { result } = renderHook(() =>
        useWorkoutBuilder({ workSecs: 45, rounds: 10 })
      );
      expect(result.current.state.workSecs).toBe(45);
      expect(result.current.state.rounds).toBe(10);
      expect(result.current.state.restSecs).toBe(10); // default
    });
  });

  describe('set', () => {
    it('directly sets any field', () => {
      const { result } = renderHook(() => useWorkoutBuilder());
      act(() => result.current.set('name', 'My Workout'));
      expect(result.current.state.name).toBe('My Workout');
    });

    it('can toggle booleans', () => {
      const { result } = renderHook(() => useWorkoutBuilder());
      act(() => result.current.set('audioCues', false));
      expect(result.current.state.audioCues).toBe(false);
    });
  });

  describe('adjustWork', () => {
    it('increments by 5s below 60s', () => {
      const { result } = renderHook(() => useWorkoutBuilder({ workSecs: 20 }));
      act(() => result.current.adjustWork(1));
      expect(result.current.state.workSecs).toBe(25);
    });

    it('increments by 15s at 60s', () => {
      const { result } = renderHook(() => useWorkoutBuilder({ workSecs: 60 }));
      act(() => result.current.adjustWork(1));
      expect(result.current.state.workSecs).toBe(75);
    });

    it('clamps to minimum of 5s', () => {
      const { result } = renderHook(() => useWorkoutBuilder({ workSecs: 5 }));
      act(() => result.current.adjustWork(-1));
      expect(result.current.state.workSecs).toBe(5);
    });
  });

  describe('adjustRest', () => {
    it('decrements by 5s', () => {
      const { result } = renderHook(() => useWorkoutBuilder({ restSecs: 10 }));
      act(() => result.current.adjustRest(-1));
      expect(result.current.state.restSecs).toBe(5);
    });

    it('allows rest to reach 0 (unlike work)', () => {
      const { result } = renderHook(() => useWorkoutBuilder({ restSecs: 5 }));
      act(() => result.current.adjustRest(-1));
      expect(result.current.state.restSecs).toBe(0);
    });
  });

  describe('adjustRounds', () => {
    it('increments rounds', () => {
      const { result } = renderHook(() => useWorkoutBuilder({ rounds: 8 }));
      act(() => result.current.adjustRounds(1));
      expect(result.current.state.rounds).toBe(9);
    });

    it('decrements rounds', () => {
      const { result } = renderHook(() => useWorkoutBuilder({ rounds: 8 }));
      act(() => result.current.adjustRounds(-1));
      expect(result.current.state.rounds).toBe(7);
    });

    it('clamps at minimum of 1', () => {
      const { result } = renderHook(() => useWorkoutBuilder({ rounds: 1 }));
      act(() => result.current.adjustRounds(-1));
      expect(result.current.state.rounds).toBe(1);
    });

    it('clamps at maximum of 30', () => {
      const { result } = renderHook(() => useWorkoutBuilder({ rounds: 30 }));
      act(() => result.current.adjustRounds(1));
      expect(result.current.state.rounds).toBe(30);
    });
  });

  describe('adjustWarmup', () => {
    it('increments by 30s below 120s', () => {
      const { result } = renderHook(() => useWorkoutBuilder({ warmupSecs: 0 }));
      act(() => result.current.adjustWarmup(1));
      expect(result.current.state.warmupSecs).toBe(30);
    });

    it('increments by 60s at 120s', () => {
      const { result } = renderHook(() => useWorkoutBuilder({ warmupSecs: 120 }));
      act(() => result.current.adjustWarmup(1));
      expect(result.current.state.warmupSecs).toBe(180);
    });

    it('clamps at 0', () => {
      const { result } = renderHook(() => useWorkoutBuilder({ warmupSecs: 0 }));
      act(() => result.current.adjustWarmup(-1));
      expect(result.current.state.warmupSecs).toBe(0);
    });
  });

  describe('adjustCooldown', () => {
    it('increments by 30s below 120s', () => {
      const { result } = renderHook(() => useWorkoutBuilder({ cooldownSecs: 90 }));
      act(() => result.current.adjustCooldown(1));
      expect(result.current.state.cooldownSecs).toBe(120);
    });
  });

  describe('computed values', () => {
    it('totalSecs includes warmup, cooldown, and intervals', () => {
      const { result } = renderHook(() =>
        useWorkoutBuilder({ workSecs: 20, restSecs: 10, rounds: 8, warmupSecs: 60, cooldownSecs: 60 })
      );
      // 8 * (20 + 10) + 60 + 60 = 240 + 120 = 360
      expect(result.current.totalSecs).toBe(360);
    });

    it('intervalSecs excludes warmup and cooldown', () => {
      const { result } = renderHook(() =>
        useWorkoutBuilder({ workSecs: 20, restSecs: 10, rounds: 8, warmupSecs: 60, cooldownSecs: 60 })
      );
      expect(result.current.intervalSecs).toBe(240);
    });

    it('totalSecs updates reactively when state changes', () => {
      const { result } = renderHook(() => useWorkoutBuilder({ workSecs: 20, restSecs: 10, rounds: 8 }));
      expect(result.current.totalSecs).toBe(240);
      act(() => result.current.adjustRounds(1));
      expect(result.current.totalSecs).toBe(270); // 9 * 30
    });
  });
});
