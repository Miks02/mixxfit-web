import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from "@ng-icons/core";
import { isControlValid } from '../../../../core/helpers/FormHelpers';
import { Button } from "../../../../shared/button/button";
import { createExerciseFormFactory } from '../../factories/exercise-factories';
import { ExerciseModalLayoutService } from '../../services/exercise-modal-layout-service';
import { ExerciseService } from '../../services/exercise-service';
import { takeUntil, tap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-create-exercise-form',
    imports: [NgIcon, FormsModule, CommonModule, FormsModule, ReactiveFormsModule, Button],
    templateUrl: './create-exercise-form.html',
    styleUrl: './create-exercise-form.css',
})
export class CreateExerciseForm {
    modalLayout = inject(ExerciseModalLayoutService);
    fb = inject(FormBuilder);
    exerciseService = inject(ExerciseService);

    config = this.modalLayout.config;
    form = createExerciseFormFactory(this.fb);
    isControlValid = isControlValid;

    muscleGroups = this.exerciseService.muscleGroups;
    exerciseCategories = this.exerciseService.exerciseCategories;

    constructor() {
        this.modalLayout.setConfig({title: "Create Exercise", action: [], showBackButton: true})
    }

    onSubmit() {
        if(this.form.invalid)
            return;
    }

}
