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
    faSolidPersonWalkingArrowLoopLeft,
    faSolidPlus,
    faSolidXmark,
} from '@ng-icons/font-awesome/solid';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-exercise-form',
    imports: [NgIcon, NgxSkeletonLoaderComponent, FormsModule],
    templateUrl: './exercise-form.html',
    styleUrl: './exercise-form.css',
    providers: [provideIcons({ faSolidDumbbell, faSolidMagnifyingGlass, faSolidFilter, faSolidPlus, faSolidXmark, faSolidPersonRunning, faSolidChildReaching, faSolidChevronRight, faSolidPersonWalkingArrowLoopLeft })]
})
export class ExerciseForm {
    isLoading: WritableSignal<boolean> = signal(false);
    isSearchOpen: WritableSignal<boolean> = signal(false);
    isFilterOpen: WritableSignal<boolean> = signal(false);

    private exerciseService = inject(ExerciseService);

    exercises = this.exerciseService.exercises;
    categories = this.exerciseService.exerciseCategories;
    muscleGroups = this.exerciseService.muscleGroups;

    searchTerm: WritableSignal<string> = signal("");
    selectedMuscleGroup: WritableSignal<string> = signal("");
    selectedCategory: WritableSignal<string> = signal("");

    filteredExercises = computed(() => {
        const exercises = this.exercises();
        const searchTerm = this.searchTerm().toLowerCase();
        const muscleGroup = this.selectedMuscleGroup().toLowerCase();
        const category = this.selectedCategory().toLowerCase();

        return exercises
        ?.filter(e => e.name.toLowerCase().includes(searchTerm))
        .filter(e => e.muscleGroupName.toLowerCase().includes(muscleGroup))
        .filter(e => e.exerciseCategoryName.toLowerCase().includes(category));
    })

    ngOnInit() {
        this.loadExercises();
    }

    loadExercises() {
        this.isLoading.set(true);
        this.exerciseService.getExercises()
        .pipe(take(1), tap(() => this.isLoading.set(false)))
        .subscribe();
    }

    onSearchChange(searchTerm: string) {
        this.searchTerm.set(searchTerm);
    }

}
