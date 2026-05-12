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
import { Button } from "../../../../shared/button/button";
import { ExerciseType } from '../../../workout/models/exercise-type';
import { ExerciseFilterType } from '../../../exercise/models/exercise-filter-type';
import { TemplateModalLayoutService } from '../../services/template-modal-layout-service';
import { ExerciseService } from '../../../exercise/services/exercise-service';
import { ExerciseSessionService } from '../../../exercise/services/exercise-session-service';
import { TemplateState } from '../../services/template-state';
import { toSignal } from '@angular/core/rxjs-interop';


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

    private exerciseModal = inject(TemplateModalLayoutService);
    private exerciseService = inject(ExerciseService);
    private router = inject(Router);
    private templateState = inject(TemplateState);

    exercises = this.exerciseService.exercises;
    categories = this.exerciseService.exerciseCategories;
    muscleGroups = this.exerciseService.muscleGroups;
    selectedExercises = this.exerciseService.selectedExercises;

    searchTerm: WritableSignal<string> = signal("");
    selectedMuscleGroup: WritableSignal<string> = signal("");
    selectedCategory: WritableSignal<string> = signal("");
    selectedFilterType: WritableSignal<ExerciseFilterType> = signal(0);

    constructor() {
        this.exerciseModal.setConfig({
            title: 'Template Exercises',
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

    hasSelectedExercises = computed(() => {
        let selectedExs = this.selectedExercises();

        if(selectedExs.size > 0) {
            return true;
        }

        return false;
    })

    getExerciseDetails(exerciseId: number) {
        this.router.navigate([`workout-form/exercises/edit/${exerciseId}`])
    }

    onSearchChange(searchTerm: string) {
        this.searchTerm.set(searchTerm);
    }

    addExercises() {
        this.templateState.addExerciseToTemplate(Array.from(this.selectedExercises()))
        this.selectedExercises().clear();
        this.router.navigate(['workout-form/templates/create']);
    }

    toggleExercise = this.exerciseService.toggleExercise;

    goToCurrentTemplate() {
        this.router.navigate([this.templateState.templateFormUrl()]);
    }

    isTemplateActive = computed(() => {
        let tempExercises = this.templateState.templateExercises();

        if(!tempExercises || tempExercises.length === 0)
            return false;
        return true;
    })

}
