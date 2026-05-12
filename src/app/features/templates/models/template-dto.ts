import { TemplateExerciseDto } from "./template-exercise-dto"

export type TemplateDto = {
    id: number,
    name: string,
    notes?: string,
    isSystem: boolean,
    exercises: TemplateExerciseDto[]
}
