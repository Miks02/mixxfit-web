import { ExerciseEntry } from "./exercise-entry"

export type WorkoutDetailsDto = {
    id: number,
    userId: string,
    name: string,
    notes?: string,
    workoutDate: string,
    createdAt: string,
    exercises: ExerciseEntry[]
}
