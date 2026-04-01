import { ExerciseType } from "./exercise-type"
import { SetEntry } from "./set-entry"


export type ExerciseEntryFormValue = {
    exerciseId: number,
    exerciseName: string,
    exerciseType: ExerciseType,
    details: SetEntry[]
}
