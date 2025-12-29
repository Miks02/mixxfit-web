import { ExerciseEntry } from "./ExerciseEntry"

export type Workout = {
    id: number,
    name: string,
    notes?: string,
    workoutDate: string,
    createdAt: string,
    ExerciseEntries: ExerciseEntry[]
}
