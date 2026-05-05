import { FormArray, FormBuilder, Validators } from "@angular/forms";


export function createCurrentTemplate(fb: FormBuilder) {
    return fb.nonNullable.group({
        name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        exercises: fb.array<Omit<TemplateExerciseView, 'isUserDefined' | 'order'>>([], [Validators.required])
    })
}
