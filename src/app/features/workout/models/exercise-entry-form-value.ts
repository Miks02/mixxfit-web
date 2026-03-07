import { CardioType } from "./cardio-type"
import { ExerciseType } from "./exercise-type"
import { SetEntry } from "./set-entry"


export type ExerciseEntryFormValue = {
    exerciseName: string,
    exerciseType: ExerciseType,
    cardioType: CardioType,
    durationMinutes: number,
    durationSeconds: number,
    distance?: number,
    avgHeartRate?: number,
    maxHeartRate?: number,
    caloriesBurned?: number,
    pace: number,
    workInterval: number,
    restInterval: number,
    intervalsCount: number,
    sets: SetEntry[]
}
