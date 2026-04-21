import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { minArrayLength } from "../../../core/helpers/form-helpers";
import { CardioType } from "../models/cardio-type";
import { CreateWorkoutDto } from "../models/create-workout-dto";
import { ExerciseEntryFormValue } from "../models/exercise-entry-form-value";
import { ExerciseType } from "../models/exercise-type";

export function createExerciseForm(fb: FormBuilder): FormGroup {
    return fb.group({
        exerciseName: ['', Validators.required],
        exerciseType: [ExerciseType.Weights, Validators.required],
        cardioType: [CardioType.SteadyState as null | CardioType],
        durationMinutes: [null as number | null],
        durationSeconds: [null as number | null],
        distance: [null as number | null],
        avgHeartRate: [null as number | null],
        maxHeartRate: [null as number | null],
        caloriesBurned: [null as number | null],
        pace: [null as number | null],
        workInterval: [null as number | null],
        restInterval: [null as number | null],
        intervalsCount: [null as number | null],
        tempWeight: null as number | null,
        tempReps: null as number | null,
        sets: fb.array([], [minArrayLength(1)])
    })
}

export function createExerciseGroup(fb: FormBuilder, data?: any): FormGroup {
  return fb.group({
    exerciseId: [data?.exerciseId || ''],
    exerciseName: [data?.exerciseName || ''],
    exerciseType: [data?.exerciseType || ''],
    details: fb.array(
      data?.details
        ? data.details.map((d: any) => fb.group({
            weight: [d.weight || null],
            reps: [d.reps || null],
            durationMinutes: [d.durationMinutes || null],
            durationSeconds: [d.durationSeconds || null],
            distance: [d.distance || null]
          }))
        : []
    )
  });
}

export function createWorkoutForm(fb: FormBuilder): FormGroup {
    const today = new Date().toISOString().substring(0, 10);
    return fb.group({
        name: ['', Validators.required],
        workoutDate: [today, Validators.required],
        exercises: fb.array([], [minArrayLength(1)]),
        notes: ['', [Validators.maxLength(150)]]
    })
}

export function createWorkoutObject(form: FormGroup): CreateWorkoutDto {
    return {
        name: form.get('name')?.value,
        workoutDate: form.get('workoutDate')?.value,
        notes: form.get('notes')?.value,
        exerciseEntries: (form.get('exercises')?.value as ExerciseEntryFormValue[]).map(exercise => ({
            exerciseId: exercise.exerciseId,
            name: exercise.exerciseName,
            exerciseType: exercise.exerciseType,
            sets: exercise.details
        }))
    }
}
