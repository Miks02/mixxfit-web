import { ExerciseEntry } from "./ExerciseEntry"

export type Workout = {
    id: number,
    name: string,
    notes?: string,
    createdAt: string,
    ExerciseEntries: ExerciseEntry[]
}
