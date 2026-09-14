export const WorkoutActivityType = {
  americanFootball: 1,
  highIntensityIntervalTraining: 63,
  running: 37,
  mixedCardio: 73,
  traditionalStrengthTraining: 50,
}

export const WorkoutTypeIdentifier = 'HKWorkoutTypeIdentifier'

export const isHealthDataAvailable = jest.fn().mockReturnValue(false)
export const requestAuthorization = jest.fn().mockResolvedValue(false)
export const saveWorkoutSample = jest.fn().mockResolvedValue(undefined)
