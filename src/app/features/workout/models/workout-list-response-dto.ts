import { WorkoutListItemDto } from './workout-list-item-dto';

export type WorkoutListResponseDto = {
    year: number | null,
    month: number | null,
    availableYears: number[],
    availableMonths: number[],
    workouts: WorkoutListItemDto[]
}
