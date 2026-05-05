import {NonNullableFormBuilder, Validators } from "@angular/forms";


export function createCurrentTemplate(fb: NonNullableFormBuilder) {
    return fb.group({
        name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        exercises: fb.array<Omit<TemplateExerciseView, 'isUserDefined' | 'order'>>([], [Validators.required])
    })
}
