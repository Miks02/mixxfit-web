import { CardioType } from "./CardioType"
import { ExerciseType } from "./ExerciseType"
import { SetEntry } from "./SetEntry"


export type ExerciseEntry = {
    id?: number,
    name: string,
    workoutId?: number,

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
