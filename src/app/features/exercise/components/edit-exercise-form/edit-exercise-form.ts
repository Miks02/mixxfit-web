import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidPersonWalkingArrowLoopLeft } from '@ng-icons/font-awesome/solid';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { isControlValid } from '../../../../core/helpers/form-helpers';
import { NotificationService } from '../../../../core/services/notification-service';
import { Button } from '@shared';
import { ExerciseType } from '@features/workout';
import { createExerciseFormFactory } from '../../factories/exercise-factories';
import { ExerciseDto } from '../../models/exercise-dto';
import { ExerciseModalLayoutService } from '../../services/exercise-modal-layout-service';
import { ExerciseService } from '../../services/exercise-service';
import { ExerciseSessionService } from '../../services/exercise-session-service';

@Component({
    selector: 'app-edit-exercise-form',
    imports: [NgIcon, FormsModule, CommonModule, ReactiveFormsModule, Button, NgxSkeletonLoaderComponent],
    providers: [provideIcons({ faSolidPersonWalkingArrowLoopLeft })],
    templateUrl: './edit-exercise-form.html',
    styleUrl: './edit-exercise-form.css',
})
export class EditExerciseForm {
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);
    private fb = inject(FormBuilder);
    private notification = inject(NotificationService);
    private exerciseSession = inject(ExerciseSessionService);

    modalLayout = inject(ExerciseModalLayoutService);
    exerciseService = inject(ExerciseService);

    config = this.modalLayout.config;
    form = createExerciseFormFactory(this.fb);
    isControlValid = isControlValid;

    muscleGroups = this.exerciseService.muscleGroups;
    exerciseCategories = computed(() =>
        this.exerciseService.exerciseCategories()?.filter(m => m.name.toLowerCase() !== "other"));

    exerciseCategoryId = toSignal(this.form.get('categoryId')?.valueChanges!);
    muscleGroupId = toSignal(this.form.get('muscleGroupId')?.valueChanges!);

    exercise: WritableSignal<ExerciseDto | undefined> = signal(undefined);
    isLoading = this.exerciseService.updateExerciseMutation.isPending;
    isDeleting = this.exerciseService.deleteExerciseMutation.isPending;

    isUserDefined = computed(() => this.exercise()?.isUserDefined ?? false);

    constructor() {
        this.modalLayout.setConfig({ title: 'Edit Exercise', action: [], showBackButton: true });
    }

    ngOnInit() {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (!id) {
            history.back();
            return;
        }

        const exercises = this.exerciseService.exercises();
        const found = exercises?.find(e => e.id === +id);

        if (!found) {
            history.back();
            return;
        }

        this.exercise.set(found);
        this.patchForm(found);
    }

    private patchForm(exercise: ExerciseDto) {
        const muscleGroup = this.muscleGroups()?.find(m => m.name === exercise.muscleGroupName);
        const category = this.exerciseCategories()?.find(c => c.name === exercise.exerciseCategoryName);

        this.form.patchValue({
            name: this.trimmedExerciseName(),
            muscleGroupId: muscleGroup?.id ?? null,
            categoryId: category?.id ?? null,
        });
    }

    trimmedExerciseName = computed(() => {
        const exercise = this.exercise();
        if(!exercise) return;

        const categoryIndex = exercise?.name.lastIndexOf('(')!;
        if(categoryIndex === -1)
            return exercise.name;

        return exercise.name.substring(0, exercise.name.lastIndexOf('(')).trim();
    })

    onSubmit() {
        if (this.form.invalid) return;

        const request = {
            id: this.exercise()!.id,
            ...this.form.value,
        };

        this.exerciseService.updateExerciseMutation.mutate(request, {
            onSuccess: () => {
                let updateMessage = "Exercise updated successfully";

                if(this.exerciseSession.isExerciseInSession(this.exercise()!.id)) {
                    updateMessage = "Exercise has been updated successfully, and has been cleared from your current session";
                    this.exerciseSession.removeExercisesById(this.exercise()!.id)
                }

                this.notification.showSuccess(updateMessage);
                this.router.navigate(['workouts/create/exercises']);
            },
            onError: (err) => {
                switch(err.errorCode) {
                    case "Exercise.NotFound":
                        this.notification.showError("Exercise not found");
                        break;
                    case "Exercise.AlreadyExists":
                        this.notification.showError("Exercise with the selected name already exists");
                        break;
                    default:
                        this.notification.showError("An error occurred while updating the exercise");
                }
            }
        });
    }

    onDelete() {
        this.exerciseService.deleteExerciseMutation.mutate(this.exercise()!.id, {
            onSuccess: () => {
                let deleteMessage = "Exercise deleted successfully";

                if(this.exerciseSession.isExerciseInSession(this.exercise()!.id)) {
                    deleteMessage = "Exercise deleted successfully, and has been cleared from your current session";
                    this.exerciseSession.removeExercisesById(this.exercise()!.id)
                }

                this.notification.showSuccess(deleteMessage);
                this.router.navigate(['workouts/create/exercises']);
            },
            onError: (err) => {
                if(err.errorCode === "Exercise.NotFound")
                    this.notification.showError("Exercise not found");
                else
                    this.notification.showError("An error occurred while deleting the exercise");
            },
        });
    }

    getMuscleGroupName = computed(() => this.muscleGroups()?.find(m => m.id === this.muscleGroupId())?.name);
    getExerciseCategoryName = computed(() => {
        const categoryName = this.exerciseCategories()?.find(e => e.id === this.exerciseCategoryId())?.name;
        return categoryName ? `(${categoryName})` : '';
    });

    getExerciseType = computed(() => {
        const value = this.exerciseCategoryId();
        return this.inferExerciseType(value) as ExerciseType;
    });

    private inferExerciseType(categoryId: number): ExerciseType | void {
        if (!this.muscleGroups()) return;
        const categoryName = this.exerciseCategories()!.find(m => m.id == categoryId)?.name;

        if (!categoryName) {
            return;
        }

        switch (categoryName) {
            case 'Cardio':
            case 'Duration':
            return ExerciseType.Cardio;
            case 'Bodyweight':
            case 'Assisted Bodyweight':
            return ExerciseType.Bodyweight;
            case 'Stretching':
            return ExerciseType.Stretching;
            default:
            return ExerciseType.Weights;
        }
    }
}
