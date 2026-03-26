import { inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { ExerciseEntryItem } from '../models/exercise-entry-item';
import { ExerciseType } from '../../workout/models/exercise-type';
import { cardioSetFactory, createExerciseFormFactory, weightSetFactory, exerciseEntryFormFactory } from '../factories/exercise-factories';

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

    getExerciseDetails(index: number | null = null): FormArray {
        const exercises = this.getExercises();

        return index
        ? exercises.at(index).get("details") as FormArray
        : exercises.at(exercises.length - 1).get("details") as FormArray
    }

    getExerciseType(index: number): FormControl {
        return this.getExercises().at(index).get("exerciseType")?.value;
    }

    addExercise(exercise: ExerciseEntryItem) {
        this.getExercises().push(exerciseEntryFormFactory(this.fb, exercise.exerciseName, exercise.exerciseType))
        this.addDetails(exercise.exerciseType)
    }


    addDetails(type: ExerciseType, index: number | null = null) {
        switch(type) {
            case ExerciseType.Weights:
            this.getExerciseDetails(index).push(weightSetFactory(this.fb));
            return;
            case ExerciseType.Bodyweight:
            this.getExerciseDetails(index).push(weightSetFactory(this.fb));
            return;
            case ExerciseType.Cardio:
            this.getExerciseDetails(index).push(cardioSetFactory(this.fb));
            return;
        }
    }

}
