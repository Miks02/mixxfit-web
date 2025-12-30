import { ExerciseEntry } from "./ExerciseEntry"

export type WorkoutDetailsDto = {
    id: number,
    userId: string,
    name: string,
    notes?: string,
    workoutDate: string,
    createdAt: string,
    exerciseEntries: ExerciseEntry[]
}
