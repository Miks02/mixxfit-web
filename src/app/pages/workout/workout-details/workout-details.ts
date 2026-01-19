import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    faSolidDumbbell,
    faSolidPersonRunning,
    faSolidChildReaching,
    faSolidCalendarDay,
    faSolidNoteSticky,
    faSolidTag
} from "@ng-icons/font-awesome/solid";
import { ActivatedRoute, Router } from '@angular/router';
import { take, tap } from 'rxjs';

import { WorkoutDetailsDto } from '../models/WorkoutDetailsDto';
import { ExerciseEntry } from '../models/ExerciseEntry';
import { WorkoutService } from '../services/workout-service';
import { ExerciseType } from '../models/ExerciseType';
import { CardioType } from '../models/CardioType';
import { Modal } from "../../../layout/utilities/modal/modal";
import { NotificationService } from '../../../core/services/notification-service';
import { ModalData } from '../../../core/models/ModalData';
import { ModalType } from '../../../core/models/ModalType';

@Component({
    selector: 'app-workout-details',
    standalone: true,
    imports: [DatePipe, NgIcon, Modal],
    templateUrl: './workout-details.html',
    styleUrl: './workout-details.css',
    providers: [
        provideIcons({
            faSolidDumbbell,
            faSolidPersonRunning,
            faSolidChildReaching,
            faSolidCalendarDay,
            faSolidNoteSticky,
            faSolidTag,
        })
    ]
})
export class WorkoutDetails  {
    private workoutService = inject(WorkoutService);
    private route = inject(ActivatedRoute);
    private router = inject(Router)
    private notificationService = inject(NotificationService)

    isModalOpen: WritableSignal<boolean> = signal(false);

    id!: number;
    workout$: WritableSignal<WorkoutDetailsDto | null> = signal(null);

    ngOnInit() {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadWorkout(this.id);
    }

    get exercises(): ExerciseEntry[] {
        return this.workout$()?.exercises ?? [];
    }

    getTotalSets(): number {
        return this.exercises.reduce((total, exercise) => total + (exercise.sets?.length ?? 0), 0);
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

    isExerciseTypeCardio(exercise: ExerciseEntry): boolean {
        return exercise.exerciseType === ExerciseType.Cardio;
    }

    isCardioTypeSteadyState(exercise: ExerciseEntry): boolean {
        return exercise.cardioType === CardioType.SteadyState;
    }

    exerciseTypeLabel(exercise: ExerciseEntry): string {
        if (exercise.exerciseType === ExerciseType.Cardio) {
            return 'Cardio';
        }
        if (exercise.exerciseType === ExerciseType.Bodyweight) {
            return 'Bodyweight';
        }
        return 'Weights';
    }

    getSetCount(exercise: ExerciseEntry): number {
        return exercise.sets?.length ?? 0;
    }

    private getExerciseTypeCount(type: ExerciseType): number {
        return this.exercises.filter(ex => ex.exerciseType === type).length;
    }

    deleteWorkout(id: number) {
        this.isModalOpen.set(true);

        this.workoutService
        .deleteWorkout(id)
        .pipe(take(1))
        .subscribe(() => {
            this.notificationService.showSuccess(
                'Workout has been deleted successfully.'
            );
            this.router.navigate(['/workouts'])
            this.closeModal();
        });
    }

    openDeleteModal() {
        this.isModalOpen.set(true);
    }

    closeModal() {
        this.isModalOpen.set(false);
    }

    buildModal(): ModalData {
        const workoutDate = new Date(this.workout$()?.workoutDate as string);
        const formattedDate = new Intl.DateTimeFormat(navigator.language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(workoutDate);

        return {
            title: `${this.workout$()?.name} | ${formattedDate}`,
            subtitle: 'You are about to delete this workout and all associated exercise data',
            type: ModalType.Warning,
            primaryActionLabel: 'Confirm',
            secondaryActionLabel: 'Close',
            primaryAction: () => this.deleteWorkout(this.id),
            secondaryAction: () => this.isModalOpen.set(false)
        };
    }

    loadWorkout(id: number) {
        return this.workoutService
        .getUserWorkout(id)
        .pipe(
            take(1),
            tap(res => this.workout$.set(res)),
            tap(() => console.log(this.workout$()))
        )
        .subscribe();
    }

}
