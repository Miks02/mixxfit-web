import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { onlyNumbersCheck } from "../../../core/helpers/FormHelpers";
import { ExerciseType } from "../../workout/models/exercise-type";


export function createExerciseFormFactory(fb: FormBuilder): FormGroup {
    return fb.group({
        name: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        muscleGroupId: [null, [Validators.required, Validators.min(1)]],
        categoryId: [null, [Validators.required, Validators.min(1)]]
    })
};

export function exerciseEntryFormFactory(fb: FormBuilder, name: string, type: ExerciseType): FormGroup {
    return fb.group({
        exerciseName: [name, [Validators.required]],
        exerciseType: [type, [Validators.required]],
        details: fb.array([])
    })
};

export function weightSetFactory(fb: FormBuilder): FormGroup {
    return fb.group({
        weight: [null as number | null, Validators.required, Validators.min(1), Validators.max(1000), onlyNumbersCheck()],
        reps: [null as number | null, Validators.required, Validators.min(1), Validators.max(1000), onlyNumbersCheck()]
    })
}

export function cardioSetFactory(fb: FormBuilder): FormGroup {
    return fb.group({
        durationMinutes: [null as number | null, Validators.required, onlyNumbersCheck()],
        durationSeconds: [null as number | null, Validators.required, onlyNumbersCheck()],
        distance: [null as number | null, Validators.required, Validators.min(1), Validators.max(1000), onlyNumbersCheck()]
    })
}

export function stretchingSetFactory(fb: FormBuilder): FormGroup {
    return fb.group({
        durationMinutes: [null as number | null, Validators.required],
        durationSeconds: [null as number | null, Validators.required],
    })
}
