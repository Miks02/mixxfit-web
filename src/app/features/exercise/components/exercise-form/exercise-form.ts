import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { ExerciseService } from '../../services/exercise-service';
import { take, tap } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    faSolidChevronRight,
    faSolidChildReaching,
    faSolidDumbbell,
    faSolidFilter,
    faSolidMagnifyingGlass,
    faSolidPersonRunning,
    faSolidPlus,
    faSolidXmark,
} from '@ng-icons/font-awesome/solid';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { ExerciseType } from '../../../workout/models/exercise-type';

@Component({
    selector: 'app-exercise-form',
    imports: [NgIcon, NgxSkeletonLoaderComponent],
    templateUrl: './exercise-form.html',
    styleUrl: './exercise-form.css',
    providers: [provideIcons({ faSolidDumbbell, faSolidMagnifyingGlass, faSolidFilter, faSolidPlus, faSolidXmark, faSolidPersonRunning, faSolidChildReaching, faSolidChevronRight })]
})
export class ExerciseForm {
    isLoading: WritableSignal<boolean> = signal(false);
    isSearchOpen: WritableSignal<boolean> = signal(false);
    isFilterOpen: WritableSignal<boolean> = signal(false);

    private exerciseService = inject(ExerciseService);

    exercises = this.exerciseService.exercises;
    categories = this.exerciseService.exerciseCategories;
    muscleGroups = this.exerciseService.muscleGroups;

    private typeLabels: Record<number, string> = {
        [ExerciseType.Weights]: 'Weights',
        [ExerciseType.Bodyweight]: 'Bodyweight',
        [ExerciseType.Cardio]: 'Cardio',
    };

    groupedExercises = computed(() => {
        const all = this.exercises();
        if (!all) return [];

        const groups = new Map<number, typeof all>();
        for (const ex of all) {
            const list = groups.get(ex.exerciseType) ?? [];
            list.push(ex);
            groups.set(ex.exerciseType, list);
        }

        return Array.from(groups.entries()).map(([type, exercises]) => ({
            type,
            label: this.typeLabels[type] ?? 'Other',
            exercises,
        }));
    });

    ngOnInit() {
        this.loadExercises();
    }

    loadExercises() {
        this.isLoading.set(true);
        this.exerciseService.getExercises()
        .pipe(take(1), tap(() => this.isLoading.set(false)))
        .subscribe();
    }

}
