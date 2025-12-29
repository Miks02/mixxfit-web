import { CreateExerciseEntry } from "./CreateExerciseEntry"

export type CreateWorkoutDto = {
    name: string,
    notes?: string,
    workoutDate: string,
    ExerciseEntries: CreateExerciseEntry[]
}
