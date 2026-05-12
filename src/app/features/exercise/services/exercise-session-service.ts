import { inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ExerciseType } from '../../workout/models/exercise-type';
import { cardioSetFactory, exerciseEntryFormFactory, stretchingSetFactory, weightSetFactory } from '../factories/exercise-factories';
import { ExerciseEntryItem } from '../models/exercise-entry-item';

@Injectable({
    providedIn: 'root',
})
export class ExerciseSessionService {
    fb = inject(FormBuilder)

    readonly form = this.fb.group({
        exercises: this.fb.array([])
    })

    getExercises(): FormArray {
        return this.form.get("exercises") as FormArray;
    }

    getExerciseById(id: number) {
        return this.getExercises().at(id);
    }

    getExerciseDetails(index: number | null = null): FormArray {
        const exercises = this.getExercises();

        return index != null
        ? exercises.at(index).get("details") as FormArray
        : exercises.at(exercises.length - 1).get("details") as FormArray
    }

    getExerciseType(index: number): ExerciseType {
        return this.getExercises().at(index).get("exerciseType")?.value!;
    }

    isExerciseInSession(exerciseIndex: number): boolean {
        return this.getExercises().controls.some(e => e.get('exerciseId')?.value == exerciseIndex);
    }

    addMultipleExercises(exercises: ExerciseEntryItem[]) {
        exercises.forEach(e => {
            if(!e.setCount || e.setCount === 0)
                return;

            this.getExercises().push(exerciseEntryFormFactory(this.fb, e))
            for(let i = 0; i < e.setCount; i++) {
                this.addDetails(e.exerciseType);
            }
        })
    }

    addExercise(exercise: ExerciseEntryItem) {
        this.getExercises().push(exerciseEntryFormFactory(this.fb, exercise))
        this.addDetails(exercise.exerciseType)
    }

    addDetails(type: ExerciseType, index: number | null = null) {
        switch(type) {
            case ExerciseType.Weights:
            case ExerciseType.Bodyweight:
                this.getExerciseDetails(index).push(weightSetFactory(this.fb));
                return;
            case ExerciseType.Cardio:
                this.getExerciseDetails(index).push(cardioSetFactory(this.fb));
                return;
            case ExerciseType.Stretching:
                this.getExerciseDetails(index).push(stretchingSetFactory(this.fb));
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
        const exercises = this.getExercises().controls.filter(e => e.get('exerciseId')?.value != exerciseIndex);

        this.getExercises().clear();
        exercises.forEach(e => this.getExercises().push(e));
    }

    clearSession() {
        this.getExercises().clear();
    }

}
