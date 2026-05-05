export type CurrentTemplate = {
    name: string,
    exercises: Omit<TemplateExerciseView, 'isUserDefined' | 'order'>[]
}
