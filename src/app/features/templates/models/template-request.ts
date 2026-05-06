import { TemplateExerciseDto } from "./template-exercise-dto"

export type TemplateRequest = {
    id?: number,
    name: string,
    notes?: string,
    exercises: TemplateExerciseDto[]
}
