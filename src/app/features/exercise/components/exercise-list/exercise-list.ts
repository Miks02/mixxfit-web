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
import { ExerciseFilterType } from '../../models/exercise-filter-type';
import { ExerciseModalLayoutService } from '../../services/exercise-modal-layout-service';
import { Button } from "../../../../shared/button/button";


@Component({
    selector: 'app-exercise-list',
    imports: [NgIcon, NgxSkeletonLoaderComponent, FormsModule, Button],
    templateUrl: './exercise-list.html',
    styleUrl: './exercise-list.css',
    providers: [provideIcons({ faSolidDumbbell, faSolidMagnifyingGlass, faSolidFilter, faSolidPlus, faSolidXmark, faSolidPersonRunning, faSolidChildReaching, faSolidChevronRight, faSolidPersonWalkingArrowLoopLeft })]
})
export class ExerciseList {
    isLoading: WritableSignal<boolean> = signal(false);
    isSearchOpen: WritableSignal<boolean> = signal(false);
    isFilterOpen: WritableSignal<boolean> = signal(false);

    exerciseModal = inject(ExerciseModalLayoutService);
    private exerciseService = inject(ExerciseService);

    exercises = this.exerciseService.exercises;
    categories = this.exerciseService.exerciseCategories;
    muscleGroups = this.exerciseService.muscleGroups;

    searchTerm: WritableSignal<string> = signal("");
    selectedMuscleGroup: WritableSignal<string> = signal("");
    selectedCategory: WritableSignal<string> = signal("");
    selectedFilterType: WritableSignal<ExerciseFilterType> = signal(0);

    filteredExercises = computed(() => {
        let exercises = this.exercises();
        const searchTerm = this.searchTerm().toLowerCase();
        const muscleGroup = this.selectedMuscleGroup()
        const category = this.selectedCategory()
        const exerciseFilter = this.selectedFilterType();

        switch (exerciseFilter) {
            case ExerciseFilterType.system:
            exercises = exercises?.filter(e => !e.isUserDefined);
            break;
            case ExerciseFilterType.user:
            exercises = exercises?.filter(e => e.isUserDefined);
            break;
            default:
        }


        return exercises
        ?.filter(e => e.name.toLowerCase().includes(searchTerm)
        && e.muscleGroupName.includes(muscleGroup) && e.exerciseCategoryName.includes(category));
    })

    constructor() {
        this.exerciseModal.setConfig({
            title: 'Exercises',
            action: [
                { icon: 'faSolidMagnifyingGlass', action: this.isSearchOpen },
                { icon: 'faSolidFilter', action: this.isFilterOpen },

            ],
            showBackButton: false
        });
    }

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
