import { inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ExerciseEntryItem } from '../models/exercise-entry-item';
import { ExerciseType } from '../../workout/models/exercise-type';
import { cardioSetFactory, weightSetFactory, exerciseEntryFormFactory, stretchingSetFactory } from '../factories/exercise-factories';

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

        return index != null
        ? exercises.at(index).get("details") as FormArray
        : exercises.at(exercises.length - 1).get("details") as FormArray
    }

    getExerciseType(index: number): ExerciseType {
        return this.getExercises().at(index).get("exerciseType")?.value;
    }

    addExercise(exercise: ExerciseEntryItem) {
        this.getExercises().push(exerciseEntryFormFactory(this.fb, exercise.exerciseName, exercise.exerciseType))
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
}
