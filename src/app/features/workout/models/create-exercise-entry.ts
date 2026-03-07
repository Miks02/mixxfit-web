import { CardioType } from "./cardio-type"
import { ExerciseType } from "./exercise-type"
import { SetEntry } from "./set-entry"


export type CreateExerciseEntry = {
    name: string,

    exerciseType: ExerciseType,
    cardioType?: CardioType,

    durationMinutes?: number,
    durationSeconds?: number,

    distanceKm?: number,
    avgHeartRate?: number,
    maxHeartRate?: number,
    caloriesBurned?: number,

    paceMinPerKm?: number,

    workIntervalSec?: number,
    restIntervalSec?: number,
    intervalsCount?: number,

    sets: SetEntry[]
}
