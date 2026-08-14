import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
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
import { Button, Modal, ModalData, ModalType } from '@shared';
import { NotificationService } from '../../../../core/services/notification-service';
import { LayoutState } from '../../../../layout/services/layout-state';
import { WorkoutDetailsSkeleton } from '../../components/workout-details-skeleton/workout-details-skeleton';
import { ExerciseEntry } from '../../models/exercise-entry';
import { ExerciseType } from '../../models/exercise-type';
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

    id: WritableSignal<number> = signal(Number(this.route.snapshot.paramMap.get('id')));
    workoutSource = this.workoutService.getWorkoutByIdQuery(this.id())
    workout = this.workoutSource.data;

    constructor() {
        this.layoutState.setTitle("Workout Details");

        effect(() => {
            const error = this.workoutSource.error();
            if (error) {
                if (error.errorCode === "Workout.NotFound")
                    this.notificationService.showError("Selected workout was not found. Please try again");
                else
                    this.notificationService.showError("An error occurred while loading the workout. Please try again.");
                this.router.navigate(['/workouts']);
            }
        })
    }

    get exercises(): ExerciseEntry[] {
        return this.workout()?.exercises ?? [];
    }

    getTotalSets = computed((): number => this.exercises.reduce((total, exercise) => total + (exercise.sets?.length ?? 0), 0));
    getWeightExerciseCount = computed(() => this.getExerciseTypeCount(ExerciseType.Weights));
    getBodyweightExerciseCount = computed(() => this.getExerciseTypeCount(ExerciseType.Bodyweight));
    getCardioExerciseCount = computed(() => this.getExerciseTypeCount(ExerciseType.Cardio));
    getStretchingExerciseCount = computed(() => this.getExerciseTypeCount(ExerciseType.Stretching));
    getOtherExerciseCount = computed(() => this.getExerciseTypeCount(ExerciseType.Other));

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

    private deleteWorkout(id: number) {
        this.isModalOpen.set(true);

        this.workoutService.deleteWorkoutMutation.mutate(id, {
            onSuccess: () => {
                this.notificationService.showSuccess('Workout has been deleted successfully.');
                this.router.navigate(['/workouts'])
            },
            onError: () => {
                this.notificationService.showError('An unexpected error occurred while deleting the workout. Please try again later.');
            },
            onSettled: () => {
                this.closeModal();
            },
        })

    }

    openDeleteModal() {
        this.isModalOpen.set(true);
    }

    closeModal() {
        this.isModalOpen.set(false);
    }

    buildModal(): ModalData {
        const workoutDate = new Date(this.workout()?.workoutDate as string);
        const formattedDate = new Intl.DateTimeFormat(navigator.language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(workoutDate);

        return {
            title: `${this.workout()?.name} | ${formattedDate}`,
            subtitle: 'You are about to delete this workout and all associated exercise data',
            type: ModalType.Warning,
            primaryActionLabel: 'Confirm',
            secondaryActionLabel: 'Close',
            primaryAction: () => this.deleteWorkout(this.id()),
            secondaryAction: () => this.isModalOpen.set(false)
        };
    }


}
