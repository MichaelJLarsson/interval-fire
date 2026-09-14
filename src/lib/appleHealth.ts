import { Platform } from 'react-native'

import {
  isHealthDataAvailable,
  requestAuthorization,
  saveWorkoutSample,
  WorkoutActivityType,
  WorkoutTypeIdentifier,
} from '@kingstinct/react-native-healthkit'

import { WorkoutType } from '@/constants/presets'
import { WorkoutRecord } from '@/store/historyStore'

// ─── Apple Health (HealthKit) integration ──────────────────────────────────────
// iOS-only. Writing a completed workout requires write ("share") authorization
// for both the workout type itself and active energy burned.

const ACTIVE_ENERGY_BURNED = 'HKQuantityTypeIdentifierActiveEnergyBurned'

export const WORKOUT_TYPE_TO_HEALTHKIT_ACTIVITY: Record<WorkoutType, WorkoutActivityType> = {
  hiit: WorkoutActivityType.highIntensityIntervalTraining,
  running: WorkoutActivityType.running,
  cardio: WorkoutActivityType.mixedCardio,
  strength: WorkoutActivityType.traditionalStrengthTraining,
}

export function isAppleHealthAvailable(): boolean {
  return Platform.OS === 'ios' && isHealthDataAvailable()
}

export async function requestAppleHealthAuthorization(): Promise<boolean> {
  if (!isAppleHealthAvailable()) return false
  try {
    return await requestAuthorization({
      toShare: [WorkoutTypeIdentifier, ACTIVE_ENERGY_BURNED],
    })
  } catch (error) {
    console.warn('[appleHealth] Failed to request authorization', error)
    return false
  }
}

export async function saveWorkoutToAppleHealth(
  record: WorkoutRecord,
  startTimestamp: number,
): Promise<void> {
  if (!isAppleHealthAvailable()) return
  try {
    await saveWorkoutSample(
      WORKOUT_TYPE_TO_HEALTHKIT_ACTIVITY[record.type],
      [],
      new Date(startTimestamp),
      new Date(record.completedAt),
      { energyBurned: record.kcalBurned },
    )
  } catch (error) {
    // A HealthKit write must never block or crash the timer-completion flow.
    console.warn('[appleHealth] Failed to save workout', error)
  }
}
