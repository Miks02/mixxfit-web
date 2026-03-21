import { FormBuilder, FormGroup, Validators } from "@angular/forms";


export function createExerciseFormFactory(fb: FormBuilder): FormGroup {
    return fb.group({
        name: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        muscleGroupId: [1, [Validators.required, Validators.min(1)]],
        categoryId: [1, [Validators.required, Validators.min(1)]]
    })
}
