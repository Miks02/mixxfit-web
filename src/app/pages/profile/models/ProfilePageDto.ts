import { UserDetailsDto } from "../../../core/models/UserDetailsDto"
import { WorkoutListItemDto } from "../../workout/models/WorkoutListItemDto"

export type ProfilePageDto = {
    userDetails: UserDetailsDto,
    recentWorkouts: WorkoutListItemDto [],

    workoutStreak?: number,
    dailyCalorieGoal: number
}
