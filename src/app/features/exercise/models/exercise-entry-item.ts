import { ExerciseType } from "../../workout/models/exercise-type"

export type ExerciseEntryItem = {
    exerciseId: number,
    exerciseName: string,
    exerciseType: ExerciseType
}
