import { WorkoutListItemDto } from "../../workout/models/workout-list-item-dto"

export type DashboardDto = {
    lastWorkoutDate: string,
    workoutStreak: number,
    recentWorkouts: WorkoutListItemDto[]
}
