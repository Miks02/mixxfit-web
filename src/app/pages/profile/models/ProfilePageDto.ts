import { WorkoutListItemDto } from "../../workout/models/WorkoutListItemDto"

export type ProfilePageDto = {
    recentWorkouts: WorkoutListItemDto [],
    workoutStreak?: number,
    dailyCalorieGoal: number
}
