import { DatePipe } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    faSolidCalendarDay,
    faSolidChildReaching,
    faSolidDumbbell,
    faSolidEllipsis,
    faSolidNoteSticky,
    faSolidPersonRunning,
    faSolidPersonWalkingArrowLoopLeft,
    faSolidTag
} from "@ng-icons/font-awesome/solid";
import { finalize, take, tap } from 'rxjs';

import { ModalData } from '../../../../core/models/modal-data';
import { ModalType } from '../../../../core/models/modal-type';
import { NotificationService } from '../../../../core/services/notification-service';
import { LayoutState } from '../../../../layout/services/layout-state';
import { Modal } from "../../../../layout/utilities/modal/modal";
import { Button } from '../../../../shared/button/button';
import { WorkoutDetailsSkeleton } from '../../components/workout-details-skeleton/workout-details-skeleton';
import { ExerciseEntry } from '../../models/exercise-entry';
import { ExerciseType } from '../../models/exercise-type';
import { WorkoutDetailsDto } from '../../models/workout-details-dto';
import { WorkoutService } from '../../services/workout-service';

@Component({
    selector: 'app-workout-details',
    standalone: true,
    imports: [DatePipe, NgIcon, Modal, Button, WorkoutDetailsSkeleton],
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
            faSolidPersonWalkingArrowLoopLeft,
            faSolidEllipsis,
        })
    ]
})
export class WorkoutDetails  {
    private workoutService = inject(WorkoutService);
    private route = inject(ActivatedRoute);
    private router = inject(Router)
    private notificationService = inject(NotificationService)
    private layoutState = inject(LayoutState);

    isModalOpen: WritableSignal<boolean> = signal(false);
    isLoading: WritableSignal<boolean> = signal(true);

    id!: number;
    workout$: WritableSignal<WorkoutDetailsDto | null> = signal(null);

    constructor() {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.layoutState.setTitle("Workout Details");
    }

    ngOnInit() {
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

    getStretchingExerciseCount(): number {
        return this.getExerciseTypeCount(ExerciseType.Stretching);
    }

    getOtherExerciseCount(): number {
        return this.getExerciseTypeCount(ExerciseType.Other);
    }

    exerciseTypeLabel(exercise: ExerciseEntry): string {
        switch (exercise.exerciseType) {
            case ExerciseType.Cardio: return 'Cardio';
            case ExerciseType.Bodyweight: return 'Bodyweight';
            case ExerciseType.Stretching: return 'Stretching';
            case ExerciseType.Other: return 'Other';
            default: return 'Weights';
        }
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
        this.isLoading.set(true);

        return this.workoutService
        .getUserWorkout(id)
        .pipe(
            take(1),
            tap(res => this.workout$.set(res)),
            finalize(() => this.isLoading.set(false))
        )
        .subscribe();
    }

}
