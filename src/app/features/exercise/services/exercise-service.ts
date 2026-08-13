import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateExerciseDto } from '../models/create-exercise-dto';
import { ExerciseDto } from '../models/exercise-dto';
import { ExercisePage } from '../models/exercise-page';
import { EditExerciseDto } from '../models/edit-exercise-dto';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { ProblemDetails } from '../../../core/models/problem-details';

@Injectable({
    providedIn: 'root',
})
export class ExerciseService {
    private apiUrl = environment.apiUrl;

    private http = inject(HttpClient);
    private queryClient = inject(QueryClient);

    public selectedExercises: WritableSignal<Set<number>> = signal(new Set())

    getExercisesQuery = injectQuery<ExercisePage, ProblemDetails>(() => ({
        queryKey: ['exercises'],
        queryFn: async () => await lastValueFrom(this.getExercises()),
        staleTime: Infinity
    }))

    public exercises = computed(() => this.getExercisesQuery.data()?.exercises);
    public muscleGroups = computed(() => this.getExercisesQuery.data()?.muscleGroups);
    public exerciseCategories = computed(() => this.getExercisesQuery.data()?.exerciseCategories);

    createExerciseMutation = injectMutation<ExerciseDto, ProblemDetails, CreateExerciseDto>(() => ({
        mutationFn: async (request: CreateExerciseDto) => await lastValueFrom(this.createExercise(request)),
        onSuccess: (res) => {
            this.queryClient.setQueryData<ExercisePage>(['exercises'], prev =>
                prev ? { ...prev, exercises: [...prev.exercises, res] } : prev);
        }
    }));

    updateExerciseMutation = injectMutation<ExerciseDto, ProblemDetails, EditExerciseDto>(() => ({
        mutationFn: async (request: EditExerciseDto) => await lastValueFrom(this.updateExercise(request)),
        onSuccess: (res) => {
            this.queryClient.setQueryData<ExercisePage>(['exercises'], prev =>
                prev ? { ...prev, exercises: prev.exercises.map(e => e.id === res.id ? res : e) } : prev);
        }
    }));

    deleteExerciseMutation = injectMutation<void, ProblemDetails, number>(() => ({
        mutationFn: async (exerciseId: number) => await lastValueFrom(this.deleteExercise(exerciseId)),
        onSuccess: (_res, exerciseId) => {
            this.queryClient.setQueryData<ExercisePage>(['exercises'], prev =>
                prev ? { ...prev, exercises: prev.exercises.filter(e => e.id !== exerciseId) } : prev);
        }
    }));

    private getExercises(): Observable<ExercisePage> {
        return this.http.get<ExercisePage>(`${this.apiUrl}/exercises-page`)
    }

    private updateExercise(request: EditExerciseDto): Observable<ExerciseDto> {
        return this.http.put<ExerciseDto>(`${this.apiUrl}/exercises`, request)
    }

    private deleteExercise(exerciseId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/exercises/${exerciseId}`)
    }

    private createExercise(request: CreateExerciseDto): Observable<ExerciseDto> {
        return this.http.post<ExerciseDto>(`${this.apiUrl}/exercises`, request)
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
