import { WorkoutListItemDto } from "../../workout/models/WorkoutListItemDto"

export type DashboardDto = {
    dailyCalories: number,
    averageSleep: number,
    waterIntake: number,
    lastWorkoutDate: string,
    recentWorkouts: WorkoutListItemDto[]
}
