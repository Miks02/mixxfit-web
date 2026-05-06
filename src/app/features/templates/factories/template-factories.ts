import {NonNullableFormBuilder, Validators } from "@angular/forms";
import { TemplateExerciseDto } from "../models/template-exercise-dto";
import { TemplateRequest } from "../models/template-request";


export function createCurrentTemplate(fb: NonNullableFormBuilder) {
    return fb.group({
        name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        exercises: fb.array<Omit<TemplateExerciseView, 'isUserDefined' | 'order'>>([], [Validators.required])
    })
}

export function mapTemplateExercises(exercises: Omit<TemplateExerciseView, 'isUserDefined' | 'order'>[]): TemplateExerciseDto[] {
    return exercises.map(e => ({exerciseId: e.exerciseId, setCount: e.setCount}))
}

export function createTemplateRequestFromForm(name: string, exercises: TemplateExerciseDto[], notes?: string): TemplateRequest {
    return {
        name: name,
        notes: notes,
        exercises: exercises
    }
}
