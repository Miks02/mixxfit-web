import { inject, Injectable, } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
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
    private pagedWorkoutsSubject = new BehaviorSubject<PagedResult<WorkoutListItemDto> | undefined>(undefined)
    private workoutSummarySubject = new BehaviorSubject<WorkoutSummaryDto | undefined>(undefined)
    private queryParams = new BehaviorSubject<QueryParams | undefined>(undefined)
    private workoutCountsSubject = new BehaviorSubject<WorkoutsPerMonthDto | null>(null)

    pagedWorkouts$ = this.pagedWorkoutsSubject.asObservable();
    workoutSummary$ = this.workoutSummarySubject.asObservable();
    workoutCounts$ = this.workoutCountsSubject.asObservable();

    private http = inject(HttpClient)

    getQueryParams() {return this.queryParams.value}
    setQueryParams(queryParams: QueryParams) {this.queryParams.next(queryParams)}

    getUserWorkoutsPage(): Observable<WorkoutPageDto> {
        const params = this.getHttpQueryParams();

        return this.http.get<WorkoutPageDto>(`${this.api}/workouts/overview`, {params}).pipe(
            tap(res => {
                this.pagedWorkoutsSubject.next(res.pagedWorkouts)
                this.workoutSummarySubject.next(res.workoutSummary)
            }),
            map(res => res)
        );
    }

    getUserWorkoutsByQuery(): Observable<PagedResult<WorkoutListItemDto>> {
        const params = this.getHttpQueryParams();

        return this.http.get<PagedResult<WorkoutListItemDto>>(`${this.api}/workouts`, {params})
        .pipe(
            tap(res => {
                this.pagedWorkoutsSubject.next(res)
            }),
            map(res => res)
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
            tap(res => this.workoutCountsSubject.next(res))
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
