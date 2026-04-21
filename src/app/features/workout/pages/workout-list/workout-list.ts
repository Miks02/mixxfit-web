import { DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    faSolidBars,
    faSolidFilter,
    faSolidChildReaching,
    faSolidDumbbell,
    faSolidMagnifyingGlass,
    faSolidXmark,
    faSolidPersonRunning
} from '@ng-icons/font-awesome/solid';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { debounceTime, distinctUntilChanged, finalize, Subject, take } from 'rxjs';
import { LayoutState } from '../../../../layout/services/layout-state';
import { WorkoutService } from '../../services/workout-service';
import { Button } from "../../../../shared/button/button";
import { Month } from '../../../../core/models/month';

@Component({
    selector: 'app-workout-list',
    imports: [RouterLink, DatePipe, FormsModule, NgIcon, NgxSkeletonLoaderComponent, Button],
    templateUrl: './workout-list.html',
    styleUrl: './workout-list.css',
    providers: [
        provideIcons({
            faSolidMagnifyingGlass,
            faSolidFilter,
            faSolidBars,
            faSolidXmark,
            faSolidDumbbell,
            faSolidPersonRunning,
            faSolidChildReaching
        })
    ]
})
export class WorkoutList {
    layoutState = inject(LayoutState);
    workoutService = inject(WorkoutService);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);

    private destroyRef = inject(DestroyRef);
    private search$ = new Subject<string>();

    isLoaded: WritableSignal<boolean> = signal(false);
    isSearching: WritableSignal<boolean> = signal(false);
    isSearchOpen: WritableSignal<boolean> = signal(false);
    isSortOpen: WritableSignal<boolean> = signal(false);
    isFilterOpen: WritableSignal<boolean> = signal(false);

    workoutSummarySource = this.workoutService.workoutSummary;
    workoutsSource = this.workoutService.workouts;
    availableYearsSource = this.workoutService.availableYears;
    availableMonthsSource = this.workoutService.availableMonths;
    selectedYearSource = this.workoutService.selectedYear;
    selectedMonthSource = this.workoutService.selectedMonth;

    search: string | null = null;
    sort: string = 'newest';
    year: WritableSignal<number | null> = signal(null);
    month: WritableSignal<number | null> = signal(null);

    workoutList = computed(() => this.workoutsSource());
    workoutSummary = computed(() => this.workoutSummarySource());
    availableYears = computed(() => this.availableYearsSource() ?? []);
    availableMonths = computed(() => this.availableMonthsSource() ?? []);
    selectedYearValue = computed(() => this.year() ?? this.availableYears()[0] ?? null);
    selectedMonthValue = computed(() => this.month() ?? this.availableMonths()[0] ?? null);

    constructor() {
        effect(() => {
            this.year.set(this.selectedYearSource());
            this.month.set(this.selectedMonthSource());

        });
    }

    ngOnInit() {
        this.layoutState.setTitle('Workouts');
        this.readQueryParams();

        this.search$
        .pipe(
            debounceTime(300),
            distinctUntilChanged(),
            takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(search => {
            this.updateQueryParams({
                search,
                sort: this.sort,
                year: this.year(),
                month: this.month()
            });
        });
    }

    readQueryParams() {
        return this.activatedRoute.queryParams
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(params => {
            this.search = params['search'] || null;
            this.sort = params['sort'] || 'newest';
            this.year.set(this.parseNullableNumber(params['year']));
            this.month.set(this.parseNullableNumber(params['month']));

            this.workoutService.setQueryParams({
                sort: this.sort,
                search: this.search,
                year: this.year(),
                month: this.month()
            });

            if (!this.isLoaded()) {
                this.isLoaded.set(true);
                this.loadWorkoutOverview();
                return;
            }
            this.loadWorkouts();
        });
    }

    updateQueryParams(params: Partial<{ search: string | null; sort: string; year: number | null; month: number | null }>) {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: params,
            queryParamsHandling: 'merge'
        });
    }

    loadWorkoutOverview() {
        this.workoutService.getUserWorkoutsPage()
        .pipe(take(1))
        .subscribe();
    }

    loadWorkouts() {
        this.isSearching.set(true);
        this.workoutService
        .getUserWorkoutsByQuery()
        .pipe(
            take(1),
            finalize(() => this.isSearching.set(false))
        )
        .subscribe();
    }

    toWorkoutForm() {
        this.router.navigate(['/workout-form']);
    }

    onSearchChange(value: string) {
        this.search$.next(value);
    }

    onSortChange() {
        this.updateQueryParams({
            sort: this.sort,
            search: this.search,
            year: this.year(),
            month: this.month()
        });
        this.isSortOpen.set(false);
    }

    onYearChange(value: string) {
        const nextYear = this.parseNullableNumber(value);
        this.updateQueryParams({ year: nextYear, month: null });
    }

    onMonthChange(value: string) {
        const nextMonth = this.parseNullableNumber(value);
        this.updateQueryParams({ month: nextMonth, year: this.year() });
    }

    toggleFilter() {
        this.isFilterOpen.update(isOpen => !isOpen);
        this.isSortOpen.set(false);
        this.isSearchOpen.set(false);
    }

    toggleSort() {
        this.isSortOpen.update(isOpen => !isOpen);
        this.isFilterOpen.set(false);
        this.isSearchOpen.set(false);
    }

    toggleSearch() {
        this.isSearchOpen.update(isOpen => !isOpen);
        this.isSortOpen.set(false);
        this.isFilterOpen.set(false);
    }

    closeSearch() {
        this.isSearchOpen.set(false);
        this.search = null;
        this.onSearchChange('');
    }

    closePopupPanels() {
        this.isSortOpen.set(false);
        this.isFilterOpen.set(false);
    }

    getWorkoutDetails(id: number) {
        this.router.navigate(['/workouts', id])
    }

    getMonthLabel(month: number): string {
        const monthName = Month[month];

        if (!monthName)
            return month.toString();

        return monthName;
    }

    private parseNullableNumber(value: string | null | undefined): number | null {
        if (value === null || value === undefined || value === '')
            return null;

        const parsed = Number(value);
        return Number.isNaN(parsed) ? null : parsed;
    }

    getWorkoutCardClass() {

        return this.workoutList()!.length < 2
        ? 'w-full'
        : 'w-full md:w-[calc(50%-0.375rem)]';
    }

}
