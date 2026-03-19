import { FormBuilder, FormGroup, Validators } from "@angular/forms";


export function createExerciseFormFactory(fb: FormBuilder): FormGroup {
    return fb.group({
        exerciseName: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        muscleGroupId: [1, [Validators.required, Validators.min(1)]],
        exerciseCategoryId: [1, [Validators.required, Validators.min(1)]]
    })
}
