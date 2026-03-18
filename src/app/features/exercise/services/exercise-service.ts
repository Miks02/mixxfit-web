import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ExerciseDto } from '../models/exercise-dto';
import { environment } from '../../../../environments/environment';
import { Observable, tap, map, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MuscleGroupDto } from '../models/muscle-group-dto';
import { ExerciseCategoryDto } from '../models/exercise-category-dto';
import { ExercisePage } from '../models/exercise-page';

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
        if(!this._exercises()) {
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

        return this.http.get<{exercises: ExerciseDto[]}>(`${this.apiUrl}/exercises`)
        .pipe(
            tap((res) => this._exercises.set(res.exercises)),
            map((res) => res.exercises)
        )
    }

}
