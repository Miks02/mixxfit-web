import { ExerciseType } from "./exercise-type"
import { SetEntry } from "./set-entry"


export type ExerciseEntry = {
    id?: number,
    exerciseId: number,
    name: string,
    workoutId?: number,
    exerciseType: ExerciseType,
    sets: SetEntry[]
}
