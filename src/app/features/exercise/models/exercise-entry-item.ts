import { ExerciseType } from "@features/workout"

export type ExerciseEntryItem = {
    exerciseId: number,
    exerciseName: string,
    exerciseType: ExerciseType,
    setCount?: number
}
