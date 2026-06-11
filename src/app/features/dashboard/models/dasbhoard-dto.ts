import { WorkoutListItemDto } from "@features/workout"

export type DashboardDto = {
    lastWorkoutDate: string,
    workoutStreak: number,
    recentWorkouts: WorkoutListItemDto[]
}
