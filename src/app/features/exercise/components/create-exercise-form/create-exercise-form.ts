import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { faSolidPersonWalkingArrowLoopLeft } from '@ng-icons/font-awesome/solid';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { isControlValid } from '../../../../core/helpers/form-helpers';
import { NotificationService } from '../../../../core/services/notification-service';
import { Button } from '@shared';
import { ExerciseType } from '@features/workout';
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
    exerciseCategories = computed(() =>
        this.exerciseService.exerciseCategories()?.filter(m => m.name.toLowerCase() !== "other"));

    exerciseCategoryId = toSignal(this.form.get("categoryId")?.valueChanges!);
    muscleGroupId = toSignal(this.form.get("muscleGroupId")?.valueChanges!);

    isLoading = this.exerciseService.createExerciseMutation.isPending;

    constructor() {
        this.modalLayout.setConfig({title: "Create Exercise", action: [], showBackButton: true})
    }

    onSubmit() {
        if(this.form.invalid)
            return;

        this.exerciseService.createExerciseMutation.mutate(this.form.value, {
            onSuccess: () => {
                this.notification.showSuccess("Exercise created successfully")
                this.router.navigate(['workout-form/exercises'])
            },
            onError: (err) => {
                switch(err.errorCode) {
                    case "Exercise.AlreadyExists":
                        this.notification.showError("Exercise with the selected name already exists");
                        break;
                    case "Exercise.MuscleGroupNotFound":
                        this.notification.showError("Selected muscle group has not been found");
                        break;
                    case "Exercise.ExerciseCategoryNotFound":
                        this.notification.showError("Selected category has not been found");
                        break;
                    default:
                        this.notification.showError("An error occurred while creating the exercise");
                }
            },
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
            return;
        }

        switch (categoryName) {
            case "Cardio":
            case "Duration":
                return ExerciseType.Cardio;
            case "Bodyweight":
            case "Assisted Bodyweight":
                return ExerciseType.Bodyweight
            case "Stretching":
                return ExerciseType.Stretching;
            default:
                return ExerciseType.Weights
        }


    }



}
