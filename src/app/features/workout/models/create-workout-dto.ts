import { CreateExerciseEntry } from "./create-exercise-entry"

export type CreateWorkoutDto = {
    name: string,
    notes?: string,
    workoutDate: string,
    exerciseEntries: CreateExerciseEntry[]
}
