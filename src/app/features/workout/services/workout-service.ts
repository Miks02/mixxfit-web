import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CreateWorkoutDto } from '../models/create-workout-dto';
import { PagedResult } from '../../../core/models/PagedResult';
import { WorkoutDetailsDto } from '../models/workout-details-dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WorkoutListItemDto } from '../models/workout-list-item-dto';
import { WorkoutPageDto } from '../models/workout-page-dto';
import { WorkoutSummaryDto } from '../models/workout-summary-dto';
import { QueryParams } from '../../../core/models/QueryParams';
import { WorkoutsPerMonthDto } from '../models/workouts-per-month-dto';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class WorkoutService {
    private readonly api: string = environment.apiUrl;

    private _pagedWorkouts: WritableSignal<PagedResult<WorkoutListItemDto> | undefined> = signal(undefined);
    private _workoutSummary: WritableSignal<WorkoutSummaryDto | undefined> = signal(undefined);
    private _queryParams: WritableSignal<QueryParams | undefined> = signal(undefined);
    private _workoutCounts: WritableSignal<WorkoutsPerMonthDto | null> = signal(null);

    readonly pagedWorkouts = this._pagedWorkouts.asReadonly();
    readonly workoutSummary = this._workoutSummary.asReadonly();
    readonly workoutCounts = this._workoutCounts.asReadonly();

    private http = inject(HttpClient)

    getQueryParams() { return this._queryParams(); }
    setQueryParams(queryParams: QueryParams) { this._queryParams.set(queryParams); }

    getUserWorkoutsPage(): Observable<WorkoutPageDto> {
        const params = this.getHttpQueryParams();

        return this.http.get<WorkoutPageDto>(`${this.api}/workouts/overview`, {params}).pipe(
            tap(res => {
                this._pagedWorkouts.set(res.pagedWorkouts);
                this._workoutSummary.set(res.workoutSummary);
            })
        );
    }

    getUserWorkoutsByQuery(): Observable<PagedResult<WorkoutListItemDto>> {
        const params = this.getHttpQueryParams();

        return this.http.get<PagedResult<WorkoutListItemDto>>(`${this.api}/workouts`, {params})
        .pipe(
            tap(res => {
                this._pagedWorkouts.set(res);
            })
        )
    }

    getUserWorkout(id: number): Observable<WorkoutDetailsDto> {
        return this.http.get<WorkoutDetailsDto>(`${this.api}/workouts/${id}`);
    }

    getUserWorkoutCountsByMonth(year: number | null = null) {

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

        if(queryParams === undefined)
            return params;

        if(queryParams.page !== null && queryParams.page !== undefined)
            params = params.set('page', queryParams.page)

        if(queryParams.sort !== null && queryParams.sort !== undefined)
            params = params.set('sort', queryParams.sort);

        if(queryParams.search !== null && queryParams.search !== undefined)
            params = params.set('search', queryParams.search);

        if(queryParams.date !== null && queryParams.date !== undefined)
            params = params.set('date', queryParams.date);

        return params;
    }

}
