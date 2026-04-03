import { useWorkoutStore } from '../workoutStore';
import type { Preset } from '@/constants/presets';

const PRESET: Preset = {
  id: 'tabata',
  name: 'Tabata Classic',
  type: 'hiit',
  workSecs: 20,
  restSecs: 10,
  rounds: 8,
  prepSecs: 10,
  warmupSecs: 0,
  cooldownSecs: 0,
};

beforeEach(() => {
  useWorkoutStore.getState().stop();
});

describe('startWorkout', () => {
  it('sets phase to prep with prepSecs', () => {
    useWorkoutStore.getState().startWorkout(PRESET);
    const { active } = useWorkoutStore.getState();
    expect(active).not.toBeNull();
    expect(active!.phase).toBe('prep');
    expect(active!.secondsLeft).toBe(10);
    expect(active!.totalSecsInPhase).toBe(10);
    expect(active!.round).toBe(0);
    expect(active!.isPaused).toBe(false);
  });

  it('falls back to 10s prep when prepSecs is 0', () => {
    const preset = { ...PRESET, prepSecs: 0 };
    useWorkoutStore.getState().startWorkout(preset);
    expect(useWorkoutStore.getState().active!.secondsLeft).toBe(10);
  });

  it('stores the preset on the active workout', () => {
    useWorkoutStore.getState().startWorkout(PRESET);
    expect(useWorkoutStore.getState().active!.preset).toBe(PRESET);
  });
});

describe('tick', () => {
  it('decrements secondsLeft by 1', () => {
    useWorkoutStore.getState().startWorkout(PRESET);
    useWorkoutStore.getState().tick();
    expect(useWorkoutStore.getState().active!.secondsLeft).toBe(9);
  });

  it('does not go below 0', () => {
    useWorkoutStore.getState().startWorkout({ ...PRESET, prepSecs: 1 });
    useWorkoutStore.getState().tick();
    useWorkoutStore.getState().tick();
    expect(useWorkoutStore.getState().active!.secondsLeft).toBe(0);
  });

  it('does nothing when paused', () => {
    useWorkoutStore.getState().startWorkout(PRESET);
    useWorkoutStore.getState().pause();
    useWorkoutStore.getState().tick();
    expect(useWorkoutStore.getState().active!.secondsLeft).toBe(10);
  });

  it('does nothing when no active workout', () => {
    useWorkoutStore.getState().tick();
    expect(useWorkoutStore.getState().active).toBeNull();
  });
});

describe('pause and resume', () => {
  it('pause sets isPaused to true', () => {
    useWorkoutStore.getState().startWorkout(PRESET);
    useWorkoutStore.getState().pause();
    expect(useWorkoutStore.getState().active!.isPaused).toBe(true);
  });

  it('resume sets isPaused to false', () => {
    useWorkoutStore.getState().startWorkout(PRESET);
    useWorkoutStore.getState().pause();
    useWorkoutStore.getState().resume();
    expect(useWorkoutStore.getState().active!.isPaused).toBe(false);
  });

  it('pause on null active is a no-op', () => {
    useWorkoutStore.getState().pause();
    expect(useWorkoutStore.getState().active).toBeNull();
  });
});

describe('setPhase', () => {
  it('transitions phase and resets secondsLeft', () => {
    useWorkoutStore.getState().startWorkout(PRESET);
    useWorkoutStore.getState().setPhase('work', 20, 20, 1);
    const { active } = useWorkoutStore.getState();
    expect(active!.phase).toBe('work');
    expect(active!.secondsLeft).toBe(20);
    expect(active!.totalSecsInPhase).toBe(20);
    expect(active!.round).toBe(1);
    expect(active!.isPaused).toBe(false);
  });

  it('preserves round when not provided', () => {
    useWorkoutStore.getState().startWorkout(PRESET);
    useWorkoutStore.getState().setPhase('work', 20, 20, 3);
    useWorkoutStore.getState().setPhase('rest', 10, 10);
    expect(useWorkoutStore.getState().active!.round).toBe(3);
  });

  it('is a no-op when no active workout', () => {
    useWorkoutStore.getState().setPhase('work', 20, 20);
    expect(useWorkoutStore.getState().active).toBeNull();
  });
});

describe('stop', () => {
  it('clears the active workout', () => {
    useWorkoutStore.getState().startWorkout(PRESET);
    useWorkoutStore.getState().stop();
    expect(useWorkoutStore.getState().active).toBeNull();
  });
});
