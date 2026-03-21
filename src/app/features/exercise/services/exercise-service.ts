import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateExerciseDto } from '../models/create-exercise-dto';
import { ExerciseCategoryDto } from '../models/exercise-category-dto';
import { ExerciseDto } from '../models/exercise-dto';
import { ExercisePage } from '../models/exercise-page';
import { MuscleGroupDto } from '../models/muscle-group-dto';

@Injectable({
    providedIn: 'root',
})
export class ExerciseService {
    private apiUrl = environment.apiUrl;
    private readonly _exercises: WritableSignal<ExerciseDto[] | undefined> = signal(undefined);
    private readonly _muscleGroups: WritableSignal<MuscleGroupDto[] | undefined> = signal(undefined);
    private readonly _excerciseCategories: WritableSignal<ExerciseCategoryDto[] | undefined> = signal(undefined);

    public exercises: Signal<ExerciseDto[] | undefined> = this._exercises;
    public muscleGroups: Signal<MuscleGroupDto[] | undefined> = this._muscleGroups;
    public exerciseCategories: Signal<ExerciseCategoryDto[] | undefined> = this._excerciseCategories;

    private http = inject(HttpClient);

    getExercises(): Observable<ExerciseDto[]> {
        if(this._exercises()) return of(this._exercises()!)

        return this.http.get<ExercisePage>(`${this.apiUrl}/exercises-page`)
        .pipe(
            tap((res) => {
                this._exercises.set(res.exercises);
                this._excerciseCategories.set(res.exerciseCategories);
                this._muscleGroups.set(res.muscleGroups);
            }),
            map((res) => res.exercises)
        )
    }

    createExercise(request: CreateExerciseDto): Observable<ExerciseDto> {
        return this.http.post<ExerciseDto>(`${this.apiUrl}/exercises`, request)
        .pipe(
            tap((exercise) => this._exercises.update(exercises => [...exercises ?? [], exercise])
        ));
    }

}
