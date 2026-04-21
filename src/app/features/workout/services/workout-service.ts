import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
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
        month: null
    });
    private _workoutCounts: WritableSignal<WorkoutsPerMonthDto | undefined> = signal(undefined);
    private _availableYears: WritableSignal<number[]> = signal([]);
    private _availableMonths: WritableSignal<number[]> = signal([]);
    private _selectedYear: WritableSignal<number | null> = signal(null);
    private _selectedMonth: WritableSignal<number | null> = signal(null);

    readonly workouts = this._workouts.asReadonly();
    readonly workoutSummary = this._workoutSummary.asReadonly();
    readonly workoutCounts = this._workoutCounts.asReadonly();
    readonly availableYears = this._availableYears.asReadonly();
    readonly availableMonths = this._availableMonths.asReadonly();
    readonly selectedYear = this._selectedYear.asReadonly();
    readonly selectedMonth = this._selectedMonth.asReadonly();

    private http = inject(HttpClient)

    getQueryParams() { return this._queryParams(); }
    setQueryParams(queryParams: QueryParams) {
        this._queryParams.set(queryParams);
    }

    getUserWorkoutsPage(): Observable<WorkoutPageDto> {
        const params = this.getHttpQueryParams();

        return this.http.get<WorkoutPageDto>(`${this.api}/workouts/overview`, {params}).pipe(
            tap(res => {
                const data = res as any;

                this._workouts.set(data.workouts ?? data.Workouts ?? []);
                this._workoutSummary.set(data.workoutSummary ?? data.WorkoutSummary);
                this._availableYears.set(data.availableYears ?? data.AvailableYears ?? []);
                this._availableMonths.set(data.availableMonths ?? data.AvailableMonths ?? []);
                this._selectedYear.set(data.year ?? data.Year ?? null);
                this._selectedMonth.set(data.month ?? data.Month ?? null);
            })
        );
    }

    getUserWorkoutsByQuery(): Observable<WorkoutListResponseDto> {
        const params = this.getHttpQueryParams();

        return this.http.get<WorkoutListResponseDto>(`${this.api}/workouts`, {params})
        .pipe(
            tap(res => {
                const data = res as any;

                this._workouts.set(data.workouts ?? data.Workouts ?? []);
                this._availableYears.set(data.availableYears ?? data.AvailableYears ?? []);
                this._availableMonths.set(data.availableMonths ?? data.AvailableMonths ?? []);
                this._selectedYear.set(data.year ?? data.Year ?? null);
                this._selectedMonth.set(data.month ?? data.Month ?? null);
            })
        )
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

        return this.http.get<WorkoutsPerMonthDto>(`${this.api}/workouts/workout-chart`, { params })
        .pipe(
            tap(res => this._workoutCounts.set(res))
        );
    }

    addWorkout(model: CreateWorkoutDto): Observable<WorkoutDetailsDto> {
        return this.http.post<WorkoutDetailsDto>(`${this.api}/workouts`, model)
    }

    deleteWorkout(id: number): Observable<void> {
        return this.http.delete<void>(`${this.api}/workouts/${id}`)
    }

    private getHttpQueryParams(): HttpParams {
        const queryParams = this.getQueryParams();
        let params = new HttpParams();

        if(queryParams.sort !== null && queryParams.sort !== undefined)
            params = params.set('sort', queryParams.sort);

        if(queryParams.search !== null && queryParams.search !== undefined)
            params = params.set('search', queryParams.search);

        if(queryParams.year !== null && queryParams.year !== undefined)
            params = params.set('year', queryParams.year);

        if(queryParams.month !== null && queryParams.month !== undefined)
            params = params.set('month', queryParams.month);

        return params;
    }

}
