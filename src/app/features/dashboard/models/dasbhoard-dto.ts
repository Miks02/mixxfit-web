import { WorkoutListItemDto } from "../../workout/models/workout-list-item-dto"

export type DashboardDto = {
    dailyCalories: number,
    averageSleep: number,
    waterIntake: number,
    lastWorkoutDate: string,
    workoutStreak: number,
    recentWorkouts: WorkoutListItemDto[]
}
