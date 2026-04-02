import { WorkoutListItemDto } from "./workout-list-item-dto"
import { WorkoutSummaryDto } from "./workout-summary-dto"

export type WorkoutPageDto = {
    year: number | null,
    month: number | null,
    availableYears: number[],
    availableMonths: number[],
    workouts: WorkoutListItemDto[],
    workoutSummary: WorkoutSummaryDto
}
