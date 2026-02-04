import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, map, Subject, take, takeUntil, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    faSolidChevronLeft,
    faSolidChevronRight,
    faSolidChildReaching,
    faSolidDumbbell,
    faSolidPersonRunning
} from '@ng-icons/font-awesome/solid';
import { LayoutState } from '../../../layout/services/layout-state';
import { WorkoutService } from '../services/workout-service';
import { WorkoutListItemDto } from '../models/WorkoutListItemDto';
import { NotificationService } from '../../../core/services/notification-service';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
    selector: 'app-workout-list',
    imports: [RouterLink, DatePipe, FormsModule, NgIcon, NgxSkeletonLoaderComponent],
    templateUrl: './workout-list.html',
    styleUrl: './workout-list.css',
    providers: [
        provideIcons({
            faSolidChevronRight,
            faSolidChevronLeft,
            faSolidDumbbell,
            faSolidPersonRunning,
            faSolidChildReaching
        })
    ]
})
export class WorkoutList {
    layoutState = inject(LayoutState);
    workoutService = inject(WorkoutService);
    notificationService = inject(NotificationService);
    router = inject(Router);

    private destroy$ = new Subject<void>();
    private search$ = new Subject<string>();

    totalCount = signal(0);
    pageSize = signal(0);

    page: number = this.workoutService.getQueryParams().page;
    search: string = this.workoutService.getQueryParams().search;
    sort: string = this.workoutService.getQueryParams().sort || 'Newest';
    date: string = this.workoutService.getQueryParams().date;

    selectedWorkout: WorkoutListItemDto | null = null;

    workoutsSource = toSignal(
        this.workoutService.pagedWorkouts$.pipe(
            tap(res => {
                this.page = res?.page as number;
                this.pageSize.set(res?.pageSize as number);
                this.totalCount.set(res?.totalCount as number);
            })
        ),
        { initialValue: null }
    );

    workoutSummarySource = toSignal(this.workoutService.workoutSummary$);
    workoutList = computed(() => {

        return this.workoutsSource()?.items
    })


    totalPages = computed(() => {
        if (!this.totalCount() || !this.pageSize())
            return 0;
        return Math.ceil(this.totalCount() / this.pageSize());
    });

    ngOnInit() {
        this.layoutState.setTitle('Workouts');
        this.loadWorkouts();
        console.log(this.workoutList())
        this.search$
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(search => {
                this.search = search;
                this.page = 1;
                this.loadWorkoutsByQuery();
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadWorkouts() {
        this.workoutService
            .getUserWorkoutsPage()
            .pipe(take(1))
            .subscribe();
    }

    loadWorkoutsByQuery(resetPage: boolean = false) {
        if (resetPage) {
            this.page = 1;
        }

        this.workoutService.setQueryParams({
            sort: this.sort,
            search: this.search,
            date: this.date,
            page: this.page
        });

        this.workoutService
            .getUserWorkoutsByQuery()
            .pipe(take(1))
            .subscribe();
    }

    onSearchChange(value: string) {
        this.search$.next(value);
    }

    getPreviousPage() {
        this.page--;
        this.loadWorkoutsByQuery();
    }

    getNextPage() {
        this.page++;
        this.loadWorkoutsByQuery();
    }

    getWorkoutDetails(id: number) {
        this.router.navigate(['/workouts', id])
    }

    getWorkoutCardClass() {

        return this.workoutList()?.length! < 2
            ? 'w-full'
            : 'w-full md:w-[calc(50%-0.375rem)]';
    }

}
