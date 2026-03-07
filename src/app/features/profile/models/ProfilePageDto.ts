import { WorkoutListItemDto } from "../../workout/models/workout-list-item-dto"

export type ProfilePageDto = {
    recentWorkouts: WorkoutListItemDto [],
    workoutStreak?: number,
    dailyCalorieGoal: number
}
