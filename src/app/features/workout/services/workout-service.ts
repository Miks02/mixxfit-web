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
import { CreateQueryResult, injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { ProblemDetails } from '../../../core/models/problem-details';

@Injectable({
    providedIn: 'root',
})
export class WorkoutService {
    private readonly api: string = environment.apiUrl;

    private http = inject(HttpClient);
    private queryClient = inject(QueryClient);

    workoutsPageQuery(month: Signal<number | null>, year: Signal<number | null>, sort: Signal<string | null>, search: Signal<string | null>) {
        return injectQuery<WorkoutPageDto, ProblemDetails>(() => {
            return {
                queryKey: ['workouts-summary'],
                queryFn: async () => {
                    const res = await lastValueFrom(this.getUserWorkoutsPage({month: month(), year: year(), sort: sort(), search: search()}));
                    this.queryClient.setQueryData(
                        ['workouts-list', month(), year(), sort(), search()],
                        res,
                    );
                    return res;
                }
            };
        });
    }

    workoutsByParamsQuery(
        month: Signal<number | null>, year: Signal<number | null>, sort: Signal<string | null>, search: Signal<string | null>,
        summaryQuery: CreateQueryResult<WorkoutPageDto, ProblemDetails>
    ) {
        return injectQuery<WorkoutListResponseDto, ProblemDetails>(() => {
            return {
                queryKey: ['workouts-list', month(), year(), sort(), search()],
                queryFn: async () => {
                    const res = await lastValueFrom(this.getUserWorkoutsByQuery({month: month(), year: year(), sort: sort(), search: search()}));
                    return res;
                },
                enabled: (month() !== null || year() !== null) && summaryQuery.isSuccess(),
            };
        });
    }

    getWorkoutByIdQuery(id: number) {
        return injectQuery<WorkoutDetailsDto, ProblemDetails>(() => {
            return {
                queryKey: ['workout', id],
                queryFn: async () => {
                    const res = await lastValueFrom(this.getUserWorkout(id));
                    return res;
                },
                enabled: id !== undefined
            };
        });
    }

    getWorkoutChartDataQuery(year: Signal<number | null>) {
        return injectQuery(() => ({
            queryKey: ['workout-chart', year()],
            queryFn: async () => {
                const res = await lastValueFrom(this.getUserWorkoutCountsByMonth(year()));
                return res;
            },
        }));
    }

    createWorkoutMutation = injectMutation<WorkoutDetailsDto, ProblemDetails, CreateWorkoutDto>(() => ({
        mutationFn: async (model: CreateWorkoutDto) => {
            const res = await lastValueFrom(this.addWorkout(model));
            return res;
        },
        onSuccess: () => {
           this.queryClient.invalidateQueries({queryKey: ['workouts-summary']})
        },
    }))

    deleteWorkoutMutation = injectMutation<void, ProblemDetails, number>(() => ({
        mutationFn: async (id: number) => {
            const res = await lastValueFrom(this.deleteWorkout(id));
            return res;
        },
        onSuccess: () => {
           this.queryClient.invalidateQueries({queryKey: ['workouts-summary']})
        },
    }))

    private getUserWorkoutsPage(params: Partial<QueryParams>): Observable<WorkoutPageDto> {
        const httpParams = this.getHttpQueryParams(params);

        return this.http.get<WorkoutPageDto>(`${this.api}/workouts/overview`, { params: httpParams });
    }

    private getUserWorkoutsByQuery(params: Partial<QueryParams>): Observable<WorkoutListResponseDto> {
        const httpParams = this.getHttpQueryParams(params)
        return this.http.get<WorkoutListResponseDto>(`${this.api}/workouts`, { params: httpParams })
    }

    private getUserWorkout(id: number): Observable<WorkoutDetailsDto> {
        return this.http.get<WorkoutDetailsDto>(`${this.api}/workouts/${id}`);
    }

    private getUserWorkoutCountsByMonth(year: number | null = null) {
        let params = new HttpParams();

        if (year !== null && year !== undefined) {
            params = params.set('year', year.toString());
        }

        return this.http.get<WorkoutsPerMonthDto>(`${this.api}/workouts/workout-chart`, { params })
    }

    private addWorkout(model: CreateWorkoutDto): Observable<WorkoutDetailsDto> {
        return this.http.post<WorkoutDetailsDto>(`${this.api}/workouts`, model);
    }

    private deleteWorkout(id: number): Observable<void> {
        return this.http.delete<void>(`${this.api}/workouts/${id}`);
    }

    private getHttpQueryParams(params: Partial<QueryParams>): HttpParams {
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
