import { CardioType } from "./cardio-type"
import { ExerciseType } from "./exercise-type"
import { SetEntry } from "./set-entry"


export type ExerciseEntry = {
    id?: number,
    name: string,
    workoutId?: number,
    exerciseType: ExerciseType,
    sets: SetEntry[]
}
