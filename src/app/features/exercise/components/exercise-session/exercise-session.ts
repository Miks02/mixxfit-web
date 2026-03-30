import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidBackward, faSolidBackwardStep, faSolidTrash } from '@ng-icons/font-awesome/solid';
import { ExerciseModalLayoutService } from '../../services/exercise-modal-layout-service';
import { ExerciseSessionService } from '../../services/exercise-session-service';
import { ExerciseType } from '../../../workout/models/exercise-type';
import { Button } from '../../../../shared/button/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
    selector: 'app-exercise-session',
    imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, NgIcon, Button],
    templateUrl: './exercise-session.html',
    styleUrl: './exercise-session.css',
    providers: [provideIcons({ faSolidTrash, faSolidBackwardStep })]
})
export class ExerciseSession {
    modalConfig = inject(ExerciseModalLayoutService);
    exerciseSession = inject(ExerciseSessionService);
    router = inject(Router);

    form = this.exerciseSession.form;

    ExerciseType = ExerciseType;

    exercises = toSignal(this.exerciseSession.getExercises().valueChanges,
    {initialValue: this.exerciseSession.getExercises().value});

    constructor() {
        this.modalConfig.setConfig({title: "Current Session", action: [], showBackButton: true})

        effect(() => {
            const exercises = this.exercises() as [];

            if(exercises?.length === 0)
                this.backToExerciseList();
        })

    }

    getExerciseType(index: number): ExerciseType {
        return this.exerciseSession.getExerciseType(index);
    }

    getExerciseTypeLabel(index: number): string {
        return ExerciseType[this.getExerciseType(index)];
    }

    addSet(exerciseIndex: number) {
        const type = this.getExerciseType(exerciseIndex);
        this.exerciseSession.addDetails(type, exerciseIndex);
    }

    removeSet(exerciseIndex: number, setIndex: number) {
        if(this.exerciseSession.getExerciseDetails(exerciseIndex).length <= 1) return;

        this.exerciseSession.removeDetails(exerciseIndex, setIndex);
    }

    removeExercise(exerciseIndex: number) {
        this.exerciseSession.removeExercise(exerciseIndex);
    }

    backToExerciseList() {
        this.router.navigate(['workout-form/exercises']);
    }
}
