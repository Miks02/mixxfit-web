import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { minArrayLength, onlyNumbersCheck } from "../../../core/helpers/form-helpers";
import { ExerciseEntryItem } from "../models/exercise-entry-item";
import { ExerciseEntryFormValue } from "@features/workout/models/exercise-entry-form-value";


export function createExerciseFormFactory(fb: FormBuilder): FormGroup {
    return fb.group({
        name: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        muscleGroupId: [null, [Validators.required, Validators.min(1)]],
        categoryId: [null, [Validators.required, Validators.min(1)]]
    })
};

export function exerciseEntryFormFactory(fb: FormBuilder, exercise: ExerciseEntryItem | ExerciseEntryFormValue): FormGroup {
    return fb.group({
        exerciseId: [exercise.exerciseId, [Validators.required]],
        exerciseName: [exercise.exerciseName, [Validators.required]],
        exerciseType: [exercise.exerciseType, [Validators.required]],
        details: fb.array([], minArrayLength(1))
    })
};

export function weightSetFactory(fb: FormBuilder, weight: number | null = null, reps: number | null = null): FormGroup {
    return fb.group({
        weight: [weight, [Validators.required, Validators.min(1), Validators.max(1000), onlyNumbersCheck()]],
        reps: [reps, [Validators.required, Validators.min(1), Validators.max(1000), onlyNumbersCheck()]]
    })
}

export function cardioSetFactory(fb: FormBuilder, durationMinutes: number | null = null, durationSeconds: number | null = null, distance: number | null = null): FormGroup {
    return fb.group({
        durationMinutes: [durationMinutes, [Validators.required, onlyNumbersCheck()]],
        durationSeconds: [durationSeconds, [Validators.required, onlyNumbersCheck()]],
        distance: [distance, [Validators.required, Validators.min(0), Validators.max(1000), onlyNumbersCheck()]]
    })
}

export function stretchingSetFactory(fb: FormBuilder, durationMinutes: number | null = null, durationSeconds: number | null = null): FormGroup {
    return fb.group({
        durationMinutes: [durationMinutes, [Validators.required, onlyNumbersCheck()]],
        durationSeconds: [durationSeconds, [Validators.required, onlyNumbersCheck()]],
    })
}
