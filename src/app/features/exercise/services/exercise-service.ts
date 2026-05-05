import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateExerciseDto } from '../models/create-exercise-dto';
import { ExerciseCategoryDto } from '../models/exercise-category-dto';
import { ExerciseDto } from '../models/exercise-dto';
import { ExercisePage } from '../models/exercise-page';
import { MuscleGroupDto } from '../models/muscle-group-dto';
import { EditExerciseDto } from '../models/edit-exercise-dto';

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

    public selectedExercises: WritableSignal<Set<number>> = signal(new Set())

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

    updateExercise(request: EditExerciseDto): Observable<ExerciseDto> {
        return this.http.put<ExerciseDto>(`${this.apiUrl}/exercises`, request)
        .pipe(
            tap((updatedExercise) => {
                this._exercises.update(exercises =>
                    exercises?.map((e) => e.id === request.id ? updatedExercise : e) ?? [])
            })
        )
    }

    deleteExercise(exerciseId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/exercises/${exerciseId}`)
        .pipe(
            tap(() => this._exercises.update(() => this.exercises()?.filter(e => e.id !== exerciseId)))
        )
    }

    createExercise(request: CreateExerciseDto): Observable<ExerciseDto> {
        return this.http.post<ExerciseDto>(`${this.apiUrl}/exercises`, request)
        .pipe(
            tap((exercise) => this._exercises.update(exercises => [...exercises ?? [], exercise])
        ));
    }

    toggleExercise(id: number) {
        const current = this.selectedExercises();
        const next = new Set(current);

        if(this.selectedExercises().has(id)) {
            next.delete(id);
            this.selectedExercises.set(next);
            return;
        }
        next.add(id);
        this.selectedExercises.set(next);
    }

}
