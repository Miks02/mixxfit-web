import { Component, inject, signal, WritableSignal } from '@angular/core';
import { LayoutState } from '../../../layout/services/layout-state';
import { RouterLink } from "@angular/router";
import { WorkoutService } from '../services/workout-service';
import { WorkoutDetailsDto } from '../models/WorkoutDetailsDto';
import { WorkoutListItemDto } from '../models/WorkoutListItemDto';
import { BehaviorSubject, map, Subject, takeUntil, tap } from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop'
import { PagedResult } from '../../../core/models/PagedResult';
import { DatePipe } from "@angular/common";
import { Modal } from "../../../layout/utilities/modal/modal";
import { ModalData } from '../../../core/models/ModalData';
import { ModalType } from '../../../core/models/ModalType';
import { NotificationService } from '../../../core/services/notification-service';

@Component({
    selector: 'app-workout-list',
    imports: [RouterLink, DatePipe, Modal],
    templateUrl: './workout-list.html',
    styleUrl: './workout-list.css',
})
export class WorkoutList {
    layoutState = inject(LayoutState)
    workoutService = inject(WorkoutService)
    notificationService = inject(NotificationService)

    isModalOpen: WritableSignal<boolean> = signal(false);
    private destroy$ = new Subject<void>()

    workouts = toSignal(this.workoutService.pagedWorkouts$
    .pipe(
        tap(res => {
            this.workoutCount = res.totalCount
            console.log(res)
        }),
        map(res => res.items)
    ), {initialValue: [] as WorkoutListItemDto[]})

    workoutSummary = toSignal(this.workoutService.workoutSummary$)

    page: number = 1;
    pageSize: number = 12;
    workoutCount: number = 0;
    selectedWorkout: WorkoutListItemDto | null = null;

    ngOnInit() {
        this.layoutState.setTitle("Workouts")
        this.loadWorkouts();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadWorkouts() {
        this.workoutService.getUserWorkouts()
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }

    deleteWorkout(id: number) {
        this.workoutService.deleteWorkout(id).pipe(
            takeUntil(this.destroy$)
        )
        .subscribe({
            next: () => {
                this.notificationService.showSuccess("Workout has been deleted successfully.")
                this.closeModal();
                this.loadWorkouts();
            }
        });
    }

    editWorkout(id: number) {

    }

    closeModal() {
        this.isModalOpen.set(false);
    }

    buildModal(): ModalData {
        const workoutDate: Date = new Date(this.selectedWorkout?.workoutDate as string)
        const userlocale = navigator.language;
        const formattedDate = new Intl.DateTimeFormat(userlocale, {
            year: 'numeric',
            month: "long",
            day: "numeric"
        }).format(workoutDate)

        return {
            title: `${this.selectedWorkout?.name} | ${formattedDate}`,
            subtitle: "Do you want to edit or delete this entry",
            type: ModalType.Question,
            primaryActionLabel: "Edit",
            secondaryActionLabel: "Delete",
            primaryAction: () => this.editWorkout(this.selectedWorkout!.id),
            secondaryAction: () => this.deleteWorkout(this.selectedWorkout!.id)
        }
    }

    getWorkoutCardClass() {
        if(this.workouts().length < 2) {
            return 'w-full'
        }

        return 'w-full md:w-[calc(50%-0.375rem)]'
    }

    getSetsBadgeClass(sets: number): string {
        if (sets >= 28) return 'bg-yellow-400';
        if (sets >= 24) return 'bg-yellow-400';
        if (sets >= 20) return 'bg-blue-400';
        return 'bg-emerald-400';
    }


}
