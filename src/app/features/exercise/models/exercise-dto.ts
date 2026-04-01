import { ExerciseType } from "../../workout/models/exercise-type"

export type ExerciseDto = {
    id: number,
    name: string,
    muscleGroupName: string,
    exerciseCategoryName: string,
    exerciseType: ExerciseType,
    isUserDefined: boolean
};
