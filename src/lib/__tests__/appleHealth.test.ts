import { WorkoutActivityType } from '@kingstinct/react-native-healthkit'

import { WorkoutType } from '@/constants/presets'

import { WORKOUT_TYPE_TO_HEALTHKIT_ACTIVITY } from '../appleHealth'

describe('WORKOUT_TYPE_TO_HEALTHKIT_ACTIVITY', () => {
  const cases: [WorkoutType, WorkoutActivityType][] = [
    ['hiit', WorkoutActivityType.highIntensityIntervalTraining],
    ['running', WorkoutActivityType.running],
    ['cardio', WorkoutActivityType.mixedCardio],
    ['strength', WorkoutActivityType.traditionalStrengthTraining],
  ]

  it.each(cases)('maps %s to the matching HealthKit activity type', (type, expected) => {
    expect(WORKOUT_TYPE_TO_HEALTHKIT_ACTIVITY[type]).toBe(expected)
  })

  it('covers every WorkoutType', () => {
    const types: WorkoutType[] = ['hiit', 'running', 'cardio', 'strength']
    expect(Object.keys(WORKOUT_TYPE_TO_HEALTHKIT_ACTIVITY).sort()).toEqual([...types].sort())
  })
})
