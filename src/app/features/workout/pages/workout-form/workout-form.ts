import { DatePipe } from '@angular/common';
import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormBuilder, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
    faSolidBars,
    faSolidBookOpen,
    faSolidCalendarDay,
    faSolidChildReaching,
    faSolidCircle,
    faSolidDumbbell,
    faSolidEllipsis,
    faSolidFireFlameCurved,
    faSolidNoteSticky,
    faSolidPersonRunning,
    faSolidPersonWalkingArrowLoopLeft,
    faSolidTag,
    faSolidTrash,
    faSolidXmark
} from "@ng-icons/font-awesome/solid";
import { handleValidationErrors, isControlValid } from '../../../../core/helpers/FormHelpers';
import { NotificationService } from '../../../../core/services/notification-service';
import { LayoutState } from '../../../../layout/services/layout-state';
import { Button } from '../../../../shared/button/button';
import { ExerciseSessionService } from '../../../exercise/services/exercise-session-service';
import { createExerciseGroup, createWorkoutForm, createWorkoutObject } from '../../factories/workout-factories';
import { ExerciseType } from '../../models/exercise-type';
import { WorkoutService } from '../../services/workout-service';

@Component({
    selector: 'app-workout-form',
    imports: [NgIcon, FormsModule, ReactiveFormsModule, DatePipe, Button, RouterOutlet],
    templateUrl: './workout-form.html',
    styleUrl: './workout-form.css',
    providers: [provideIcons({faSolidTag, faSolidCalendarDay, faSolidDumbbell, faSolidFireFlameCurved, faSolidBookOpen, faSolidBars, faSolidNoteSticky, faSolidXmark, faSolidCircle, faSolidPersonRunning, faSolidChildReaching, faSolidPersonWalkingArrowLoopLeft, faSolidEllipsis, faSolidTrash})]
})
export class WorkoutForm {
    isControlValid = isControlValid;

    layoutState = inject(LayoutState);
    fb = inject(FormBuilder);
    workoutService = inject(WorkoutService);
    exerciseSession = inject(ExerciseSessionService);
    router = inject(Router);
    notificationService = inject(NotificationService);

    form = createWorkoutForm(this.fb);

    isLoading: WritableSignal<boolean> = signal(false);

    get exercises() {
        return this.exerciseSession.getExercises();
    }
    private exerciseSource = toSignal(this.exerciseSession.getExercises().valueChanges,
    {initialValue: this.exerciseSession.getExercises().value});;

    constructor() {
        this.layoutState.setTitle("Workout Form")

        effect(() => {
            const exercises = this.exerciseSource();

            const data = exercises.map((ex: any) => createExerciseGroup(this.fb, ex))

            this.form.setControl('exercises', new FormArray(data), {emitEvent: false})
        })
    }

    getTotalSets(): number {
        let total = 0;
        for (const exercise of this.exerciseSession.getExercises().controls) {
            const sets = exercise.get('sets') as FormArray | null;
            total += sets?.length ?? 0;
        }
        return total;
    }

    getSetControls(exercise: AbstractControl): AbstractControl[] {
        const details = exercise.get('details') as FormArray;
        return details ? details.controls : [];
    }

    getWeightExerciseCount(): number {
        return this.getExerciseTypeCount(ExerciseType.Weights);
    }

    getBodyweightExerciseCount(): number {
        return this.getExerciseTypeCount(ExerciseType.Bodyweight);
    }

    getCardioExerciseCount(): number {
        return this.getExerciseTypeCount(ExerciseType.Cardio);
    }

    getStretchingExerciseCount(): number {
        return this.getExerciseTypeCount(ExerciseType.Stretching);
    }

    getOtherExerciseCount(): number {
        return this.getExerciseTypeCount(ExerciseType.Other);
    }

    private getExerciseTypeCount(type: ExerciseType): number {
        let count = 0;
        for (const exercise of this.exerciseSession.getExercises().controls) {
            if (exercise.get('exerciseType')?.value === type) {
                count++;
            }
        }
        return count;
    }

    getExerciseSets(exerciseId: number) {
        return this.exerciseSession.getExerciseDetails(exerciseId).value
    }

    getExerciseType(exercise: AbstractControl) {
        return exercise.get("exerciseType")?.value;
    }

    exerciseTypeLabel(exercise: AbstractControl): string {
        const type = exercise.get("exerciseType")?.value;
        if (type === ExerciseType.Cardio) {
            return 'Cardio';
        }
        if (type === ExerciseType.Bodyweight) {
            return 'Bodyweight';
        }
        return 'Weights';
    }

    getSetCount(exercise: AbstractControl): number {
        const sets = exercise.get('sets') as FormArray;
        return sets?.length ?? 0;
    }

    removeExercise(index: number) {
        return this.exerciseSession.getExercises().removeAt(index);
    }

    openExerciseList() {
        this.router.navigate(['/workout-form/exercises']);
    }

    onSubmit() {
        if(this.form.invalid)
            return;

        this.isLoading.set(true);
        const workout = createWorkoutObject(this.form);
        this.form.disable();
        this.workoutService.addWorkout(workout)
        .subscribe({
            next: () => {
                this.notificationService.showSuccess("Workout logged successfully!")
                this.router.navigate(['/workouts'])
                this.isLoading.set(false);
            },
            error: err  => {
                if(err.error.errorCode === "General.LimitReached") {
                    this.notificationService.showWarning("Slow down! You've logged 5 workouts today. Rest is just as important as the grind. Try again tomorrow!");
                    return;
                }
                handleValidationErrors(err, this.form);
                this.form.enable();
                this.isLoading.set(false);
            }

        })
    }
}
