import { effect, inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder } from '@angular/forms';
import { ExerciseEntryFormValue } from '@features/workout/models/exercise-entry-form-value';
import { SetEntry } from '@features/workout/models/set-entry';
import { debounceTime } from 'rxjs';
import { ExerciseType } from '../../workout';
import {
    cardioSetFactory,
    exerciseEntryFormFactory,
    stretchingSetFactory,
    weightSetFactory,
} from '../factories/exercise-factories';
import { ExerciseEntryItem } from '../models/exercise-entry-item';
import { UserState } from '../../../core/states/user-state';

@Injectable({
    providedIn: 'root',
})
export class ExerciseSessionService {
    fb = inject(FormBuilder);
    userState = inject(UserState);

    readonly form = this.fb.group({
        exercises: this.fb.array([]),
    });

    private _loadedFormExercises: Signal<ExerciseEntryFormValue[]> = toSignal(
        this.getExercises()?.valueChanges.pipe(debounceTime(600)),
        { initialValue: [] },
    );

    constructor() {
        const parsedExercises = JSON.parse(
            localStorage.getItem('exercises') ?? '[]',
        ) as ExerciseEntryFormValue[];
        this.addMultipleExercisesFromForm(parsedExercises);

        effect(() => {
            const exercises = this._loadedFormExercises();
            if (exercises.length > 0) {
                localStorage.setItem('exercises', JSON.stringify(exercises));
                return;
            }
            localStorage.removeItem('exercises');
        });
    }

    getExercises(): FormArray {
        return this.form.get('exercises') as FormArray;
    }

    getExerciseById(id: number) {
        return this.getExercises().at(id);
    }

    getExerciseDetails(index: number | null = null): FormArray {
        const exercises = this.getExercises();

        return index != null
            ? (exercises.at(index).get('details') as FormArray)
            : (exercises.at(exercises.length - 1).get('details') as FormArray);
    }

    getExerciseType(index: number): ExerciseType {
        return this.getExercises().at(index).get('exerciseType')?.value!;
    }

    isExerciseInSession(exerciseIndex: number): boolean {
        return this.getExercises().controls.some(
            (e) => e.get('exerciseId')?.value == exerciseIndex,
        );
    }

    addMultipleExercises(exercises: ExerciseEntryItem[]) {
        exercises.forEach((e) => {
            if (!e.setCount || e.setCount === 0) return;
            this.getExercises().push(exerciseEntryFormFactory(this.fb, e));
            for (let i = 0; i < e.setCount; i++) {
                this.addDetails(e.exerciseType);
            }
        });
    }

    addExercise(exercise: ExerciseEntryItem) {
        this.getExercises().push(exerciseEntryFormFactory(this.fb, exercise));
        this.addDetails(exercise.exerciseType);
    }

    addDetails(type: ExerciseType, index: number | null = null, setDetails?: Partial<SetEntry>) {
        switch (type) {
            case ExerciseType.Weights:
                this.getExerciseDetails(index).push(
                    weightSetFactory(this.fb, setDetails?.weight, setDetails?.reps),
                );
                return;
            case ExerciseType.Bodyweight:
                this.getExerciseDetails(index).push(
                    weightSetFactory(
                        this.fb,
                        this.userState.userDetails()?.currentWeight ?? setDetails?.weight,
                        setDetails?.reps,
                    ),
                );
                this.getExerciseDetails().updateValueAndValidity({ onlySelf: false });
                return;
            case ExerciseType.Cardio:
                this.getExerciseDetails(index).push(
                    cardioSetFactory(
                        this.fb,
                        setDetails?.durationMinutes,
                        setDetails?.durationSeconds,
                        setDetails?.distance,
                    ),
                );
                return;
            case ExerciseType.Stretching:
                this.getExerciseDetails(index).push(
                    stretchingSetFactory(
                        this.fb,
                        setDetails?.durationMinutes,
                        setDetails?.durationSeconds,
                    ),
                );
                return;
        }
    }

    removeDetails(exerciseIndex: number, setIndex: number) {
        this.getExerciseDetails(exerciseIndex).removeAt(setIndex);
    }

    removeExercise(exerciseIndex: number) {
        this.getExercises().removeAt(exerciseIndex);
    }

    removeExercisesById(exerciseIndex: number) {
        const exercises = this.getExercises().controls.filter(
            (e) => e.get('exerciseId')?.value != exerciseIndex,
        );

        this.getExercises().clear();
        exercises.forEach((e) => this.getExercises().push(e));
    }

    clearSession() {
        this.getExercises().clear();
    }

    // This is used only for constructor/effect synchronization. In other words,
    // it is called after the effect has run to ensure the form is in sync with the signal.
    private addMultipleExercisesFromForm(exercises: ExerciseEntryFormValue[]) {
        const exerciseDetails = exercises.map((e) => e.details);
        exercises.forEach((e, index) => {
            const exerciseForm = exerciseEntryFormFactory(this.fb, e);
            this.getExercises().push(exerciseForm);

            exerciseDetails[index].forEach((d) => {
                this.addDetails(e.exerciseType, index, {
                    weight: d.weight,
                    reps: d.reps,
                    distance: d.distance,
                    durationSeconds: d.durationSeconds,
                    durationMinutes: d.durationMinutes,
                });
            });
        });
    }
}
