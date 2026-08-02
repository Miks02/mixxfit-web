import { TemplateExerciseView } from "./template-exercise-view"

export type CurrentTemplate = {
    name: string,
    exercises: Omit<TemplateExerciseView, 'isUserDefined' | 'order'>[]
}
