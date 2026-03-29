import { ExerciseType } from "./exercise-type"
import { SetEntry } from "./set-entry"


export type ExerciseEntryFormValue = {
    exerciseName: string,
    exerciseType: ExerciseType,
    details: SetEntry[]
}
