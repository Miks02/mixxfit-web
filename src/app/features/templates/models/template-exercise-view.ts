import { ExerciseType } from "@features/workout";

export type TemplateExerciseView = {
    exerciseId: number;
    setCount: number;
    order: number;
    exerciseName: string;
    muscleGroupName: string;
    exerciseType: ExerciseType;
    isUserDefined: boolean;
};
