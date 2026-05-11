import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    faSolidChildReaching,
    faSolidDumbbell,
    faSolidFilter,
    faSolidGear,
    faSolidMagnifyingGlass,
    faSolidPersonRunning,
    faSolidPersonWalkingArrowLoopLeft,
    faSolidPlus,
    faSolidXmark
} from '@ng-icons/font-awesome/solid';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { ExerciseFilterType } from '../../models/exercise-filter-type';
import { ExerciseModalLayoutService } from '../../services/exercise-modal-layout-service';
import { ExerciseService } from '../../services/exercise-service';
import { ExerciseSessionService } from '../../services/exercise-session-service';
import { ExerciseType } from '../../../workout/models/exercise-type';
import { Button } from "../../../../shared/button/button";


@Component({
    selector: 'app-exercise-list',
    imports: [NgIcon, NgxSkeletonLoaderComponent, FormsModule, Button],
    templateUrl: './exercise-list.html',
    styleUrl: './exercise-list.css',
    providers: [provideIcons({ faSolidDumbbell, faSolidMagnifyingGlass, faSolidFilter, faSolidPlus, faSolidXmark, faSolidPersonRunning, faSolidChildReaching, faSolidGear, faSolidPersonWalkingArrowLoopLeft })]
})
export class ExerciseList {
    isSearchOpen: WritableSignal<boolean> = signal(false);
    isFilterOpen: WritableSignal<boolean> = signal(false);

    private exerciseModal = inject(ExerciseModalLayoutService);
    private exerciseService = inject(ExerciseService);
    private router = inject(Router);
    private exerciseSession = inject(ExerciseSessionService);

    exercises = this.exerciseService.exercises;
    categories = this.exerciseService.exerciseCategories;
    muscleGroups = this.exerciseService.muscleGroups;

    searchTerm: WritableSignal<string> = signal("");
    selectedMuscleGroup: WritableSignal<string> = signal("");
    selectedCategory: WritableSignal<string> = signal("");
    selectedFilterType: WritableSignal<ExerciseFilterType> = signal(0);

    constructor() {
        this.exerciseModal.setConfig({
            title: 'Workout Exercises',
            action: [
                { icon: 'faSolidMagnifyingGlass', action: this.isSearchOpen },
                { icon: 'faSolidFilter', action: this.isFilterOpen },

            ],
            showBackButton: false
        });
    }

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

    isLoading = computed(() => {
        const exercises = this.exercises();

        if(!exercises)
            return true;
        return false;
    })

    getExerciseDetails(exerciseId: number) {
        this.router.navigate([`workout-form/exercises/edit/${exerciseId}`])
    }

    onSearchChange(searchTerm: string) {
        this.searchTerm.set(searchTerm);
    }

    addExercise(id: number, name: string, type: ExerciseType) {
        this.exerciseSession.addExercise({exerciseId: id, exerciseName: name, exerciseType: type});
        this.router.navigate(['workout-form/exercises/session']);
    }

    goToCurrentSession() {
        this.router.navigate(['workout-form/exercises/session']);
    }

    isSessionActive() {
        return this.exerciseSession.getExercises().length > 0;
    }

}
