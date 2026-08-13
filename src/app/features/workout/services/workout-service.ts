import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { lastValueFrom, Observable, tap } from 'rxjs';
import { CreateWorkoutDto } from '../models/create-workout-dto';
import { WorkoutDetailsDto } from '../models/workout-details-dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WorkoutListItemDto } from '../models/workout-list-item-dto';
import { WorkoutPageDto } from '../models/workout-page-dto';
import { WorkoutSummaryDto } from '../models/workout-summary-dto';
import { QueryParams } from '../models/query-params';
import { WorkoutsPerMonthDto } from '../models/workouts-per-month-dto';
import { environment } from '../../../../environments/environment';
import { WorkoutListResponseDto } from '../models/workout-list-response-dto';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { ProblemDetails } from '../../../core/models/problem-details';

@Injectable({
    providedIn: 'root',
})
export class WorkoutService {
    private readonly api: string = environment.apiUrl;

    private _workouts: WritableSignal<WorkoutListItemDto[] | undefined> = signal(undefined);
    private _workoutSummary: WritableSignal<WorkoutSummaryDto | undefined> = signal(undefined);
    private _queryParams: WritableSignal<QueryParams> = signal({
        search: null,
        sort: 'newest',
        year: null,
        month: null,
    });
    private _workoutCounts: WritableSignal<WorkoutsPerMonthDto | undefined> = signal(undefined);
    private _selectedYear: WritableSignal<number | null> = signal(null);
    private _selectedMonth: WritableSignal<number | null> = signal(null);
    private _isSummaryLoaded: WritableSignal<boolean> = signal(false);

    readonly workouts = this._workouts.asReadonly();
    readonly workoutSummary = this._workoutSummary.asReadonly();
    readonly workoutCounts = this._workoutCounts.asReadonly();
    // readonly availableYears = computed(() => this.workoutsPageQuery.data()?.availableYears);
    // readonly availableMonths = computed(() => this.workoutsPageQuery.data()?.availableMonths);
    readonly selectedYear = this._selectedYear.asReadonly();
    readonly selectedMonth = this._selectedMonth.asReadonly();

    workoutsPageQuery(month: Signal<number | null>, year: Signal<number | null>) {
        return injectQuery<WorkoutPageDto, ProblemDetails>(() => {
            return {
                queryKey: ['workouts-summary'],
                queryFn: async () => {
                    const res = await lastValueFrom(this.getUserWorkoutsPage({month: month(), year: year()}));
                    this.queryClient.setQueryData(
                        ['workouts-list', month(), year()],
                        res,
                    );
                    console.log('Summary res', res);
                    return res;
                },
                onSuccess: () => {
                    this._isSummaryLoaded.set(true);
                },
            };
        });
    }

    workoutsByParamsQuery(month: Signal<number | null>, year: Signal<number | null>) {
        return injectQuery<WorkoutListResponseDto, ProblemDetails>(() => {
            console.log("rar")
            return {
                queryKey: ['workouts-list', month(), year()],
                queryFn: async () => {
                    console.log("Year and month params: ", year(), month())

                    const res = await lastValueFrom(this.getUserWorkoutsByQuery({month: month(), year: year()}));
                    console.log('Querying workouts by params', res);
                    return res;
                },
                enabled: month() !== null || year() !== null,
            };
        });
    }

    private http = inject(HttpClient);
    private queryClient = inject(QueryClient);

    getQueryParams() {
        return this._queryParams();
    }
    setQueryParams(queryParams: QueryParams) {
        this._queryParams.set(queryParams);
    }

    getUserWorkoutsPage(params: Partial<QueryParams>): Observable<WorkoutPageDto> {
        const httpParams = this.getHttpQueryParams2(params);

        return this.http.get<WorkoutPageDto>(`${this.api}/workouts/overview`, { params: httpParams });
    }

    getUserWorkoutsByQuery(params: Partial<QueryParams>): Observable<WorkoutListResponseDto> {
        const httpParams = this.getHttpQueryParams2(params)
        return this.http.get<WorkoutListResponseDto>(`${this.api}/workouts`, { params: httpParams })
    }

    getUserWorkout(id: number): Observable<WorkoutDetailsDto> {
        return this.http.get<WorkoutDetailsDto>(`${this.api}/workouts/${id}`);
    }

    getUserWorkoutCountsByMonth(year: number | null = null) {
        this._workoutCounts.set(undefined);
        let params = new HttpParams();

        if (year !== null && year !== undefined) {
            params = params.set('year', year.toString());
        }

        return this.http
            .get<WorkoutsPerMonthDto>(`${this.api}/workouts/workout-chart`, { params })
            .pipe(tap((res) => this._workoutCounts.set(res)));
    }

    addWorkout(model: CreateWorkoutDto): Observable<WorkoutDetailsDto> {
        return this.http.post<WorkoutDetailsDto>(`${this.api}/workouts`, model);
    }

    deleteWorkout(id: number): Observable<void> {
        return this.http.delete<void>(`${this.api}/workouts/${id}`);
    }

    private getHttpQueryParams(): HttpParams {
        const queryParams = this.getQueryParams();
        let params = new HttpParams();

        if (queryParams.sort !== null && queryParams.sort !== undefined)
            params = params.set('sort', queryParams.sort);

        if (queryParams.search !== null && queryParams.search !== undefined)
            params = params.set('search', queryParams.search);

        if (queryParams.year !== null && queryParams.year !== undefined)
            params = params.set('year', queryParams.year);

        if (queryParams.month !== null && queryParams.month !== undefined)
            params = params.set('month', queryParams.month);

        return params;
    }

    private getHttpQueryParams2(params: Partial<QueryParams>): HttpParams {
        let httpParams = new HttpParams();

        if (params.sort !== null && params.sort !== undefined)
            httpParams = httpParams.set('sort', params.sort);

        if (params.search !== null && params.search !== undefined)
            httpParams = httpParams.set('search', params.search);

        if (params.year !== null && params.year !== undefined)
            httpParams = httpParams.set('year', params.year);

        if (params.month !== null && params.month !== undefined)
            httpParams = httpParams.set('month', params.month);

        return httpParams;
    }
}
