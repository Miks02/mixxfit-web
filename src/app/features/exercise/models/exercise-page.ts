import { ExerciseCategoryDto } from "./exercise-category-dto"
import { ExerciseDto } from "./exercise-dto"
import { MuscleGroupDto } from "./muscle-group-dto"

export type ExercisePage = {
    exercises: ExerciseDto[],
    muscleGroups: MuscleGroupDto[],
    exerciseCategories: ExerciseCategoryDto[]
};
