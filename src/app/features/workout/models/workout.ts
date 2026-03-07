import { ExerciseEntry } from "./exercise-entry"

export type Workout = {
    id: number,
    name: string,
    notes?: string,
    workoutDate: string,
    createdAt: string,
    ExerciseEntries: ExerciseEntry[]
}
