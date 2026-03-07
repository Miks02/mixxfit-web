import { ExerciseType } from "./exercise-type"

export type WorkoutSummaryDto = {
    workoutCount: number,
    exerciseCount: number,
    lastWorkoutDate: string,
    favoriteExerciseType: ExerciseType
}
