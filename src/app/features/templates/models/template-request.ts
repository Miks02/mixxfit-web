import { TemplateExerciseDto } from "./template-exercise-dto"

export type TemplateRequest = {
    id: number | null,
    name: string,
    notes?: string,
    exercises: TemplateExerciseDto[]
}
