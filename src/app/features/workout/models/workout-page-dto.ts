import { PagedResult } from "../../../core/models/PagedResult"
import { WorkoutListItemDto } from "./workout-list-item-dto"
import { WorkoutSummaryDto } from "./workout-summary-dto"

export type WorkoutPageDto = {
    pagedWorkouts: PagedResult<WorkoutListItemDto>,
    workoutSummary: WorkoutSummaryDto
}
