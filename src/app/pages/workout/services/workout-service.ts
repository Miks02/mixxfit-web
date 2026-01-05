import { inject, Injectable, runInInjectionContext } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { Workout } from '../models/Workout';
import { CreateWorkoutDto } from '../models/CreateWorkoutDto';
import { PagedResult } from '../../../core/models/PagedResult';
import { WorkoutDetailsDto } from '../models/WorkoutDetailsDto';
import { HttpClient } from '@angular/common/http';
import { WorkoutListItemDto } from '../models/WorkoutListItemDto';
import { ApiResponse } from '../../../core/models/ApiResponse';
import { WorkoutPageDto } from '../models/WorkoutPageDto';
import { WorkoutSummaryDto } from '../models/WorkoutSummaryDto';

@Injectable({
    providedIn: 'root',
})
export class WorkoutService {
    private readonly api: string = "https://localhost:7263/api";
    private pagedWorkoutsSubject = new BehaviorSubject<PagedResult<WorkoutListItemDto>>(
        {
            items: [],
            totalCount: 0,
            page: 1,
            pageSize: 10
        }
    );
    private workoutSummarySubject = new BehaviorSubject<WorkoutSummaryDto | undefined>(undefined)
    
    pagedWorkouts$ = this.pagedWorkoutsSubject.asObservable();
    workoutSummary$ = this.workoutSummarySubject.asObservable();

    private http = inject(HttpClient)

    getUserWorkouts(): Observable<WorkoutPageDto> {
        return this.http.get<WorkoutPageDto>(`${this.api}/workout/all`).pipe(
            tap(res => {
                this.pagedWorkoutsSubject.next(res.pagedWorkouts)
                this.workoutSummarySubject.next(res.workoutSummary)
            }),
            map(res => res)
        );
    }

    addWorkout(model: CreateWorkoutDto): Observable<WorkoutDetailsDto> {
        return this.http.post<WorkoutDetailsDto>(`${this.api}/workout`, model).pipe(
            tap(res => console.log(res))
        )

    }

    deleteWorkout(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.api}/workout/delete/${id}`).pipe(
            tap(res => console.log("Delete response: ", res))
        )
    }

}
