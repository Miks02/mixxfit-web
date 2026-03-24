import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { faSolidPersonWalkingArrowLoopLeft } from '@ng-icons/font-awesome/solid';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { finalize, take } from 'rxjs';
import { isControlValid } from '../../../../core/helpers/FormHelpers';
import { NotificationService } from '../../../../core/services/notification-service';
import { Button } from "../../../../shared/button/button";
import { ExerciseType } from '../../../workout/models/exercise-type';
import { createExerciseFormFactory } from '../../factories/exercise-factories';
import { ExerciseModalLayoutService } from '../../services/exercise-modal-layout-service';
import { ExerciseService } from '../../services/exercise-service';

@Component({
    selector: 'app-create-exercise-form',
    imports: [NgIcon, FormsModule, CommonModule, FormsModule, ReactiveFormsModule, Button, NgxSkeletonLoaderComponent],
    providers: [provideIcons({faSolidPersonWalkingArrowLoopLeft})],
    templateUrl: './create-exercise-form.html',
    styleUrl: './create-exercise-form.css',
})
export class CreateExerciseForm {
    modalLayout = inject(ExerciseModalLayoutService);
    fb = inject(FormBuilder);
    exerciseService = inject(ExerciseService);
    notification = inject(NotificationService);
    router = inject(Router);

    config = this.modalLayout.config;
    form = createExerciseFormFactory(this.fb);
    isControlValid = isControlValid;

    muscleGroups = this.exerciseService.muscleGroups;
    exerciseCategories = this.exerciseService.exerciseCategories;

    exerciseCategoryId = toSignal(this.form.get("categoryId")?.valueChanges!);
    muscleGroupId = toSignal(this.form.get("muscleGroupId")?.valueChanges!);

    isLoading: WritableSignal<boolean> = signal(false);

    constructor() {
        this.modalLayout.setConfig({title: "Create Exercise", action: [], showBackButton: true})
    }

    onSubmit() {
        if(this.form.invalid)
            return;

        this.isLoading.set(true);

        this.exerciseService.createExercise(this.form.value)
        .pipe(take(1), finalize(() => this.isLoading.set(false)))
        .subscribe({
            next: () => {
                this.notification.showSuccess("Exercise created successfully")
                this.router.navigate(['workout-form/exercises'])
            },
            error: () => this.notification.showError("An error occurred while creating an exercise"),
        })
    }

    getMuscleGroupName = computed(() => this.muscleGroups()?.find(m => m.id === this.muscleGroupId())?.name);
    getExerciseCategoryName = computed(() => {
        const categoryName = this.exerciseCategories()?.find(e => e.id === this.exerciseCategoryId())?.name
        return categoryName ? `(${categoryName})` : "";
    })

    getExerciseType = computed(() => {
        const value = this.exerciseCategoryId();

        return this.inferExerciseType(value) as ExerciseType;
    })

    private inferExerciseType(categoryId: number): ExerciseType | void {
        if(!this.muscleGroups()) return;
        const categoryName = this.exerciseCategories()!.find(m => m.id == categoryId)?.name;

        if(!categoryName) {
            console.error(`Error occurred: Muscle group with id ${categoryId} has not been found`);
            return;
        }

        switch (categoryName) {
            case "Cardio":
            case "Duration":
                return ExerciseType.Cardio;
            case "Bodyweight":
            case "Assisted Bodyweight":
                return ExerciseType.Bodyweight
            case "Other":
                return ExerciseType.Other;
            case "Stretching":
                return ExerciseType.Stretching;
            default:
                return ExerciseType.Weights
        }


    }



}
