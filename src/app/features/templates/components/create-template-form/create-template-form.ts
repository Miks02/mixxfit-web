import { Component, effect, inject } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    faSolidChildReaching,
    faSolidDumbbell,
    faSolidPersonRunning,
    faSolidPersonWalkingArrowLoopLeft,
    faSolidTrash,
} from '@ng-icons/font-awesome/solid';
import { Button } from '../../../../shared/button/button';
import { TemplateState } from '../../services/template-state';
import { TemplateModalLayoutService } from '../../services/template-modal-layout-service';

@Component({
    selector: 'app-create-template-form',
    imports: [NgIcon, FormsModule, ReactiveFormsModule, Button],
    templateUrl: './create-template-form.html',
    styleUrl: './create-template-form.css',
    providers: [provideIcons({ faSolidDumbbell, faSolidPersonRunning, faSolidChildReaching, faSolidPersonWalkingArrowLoopLeft, faSolidTrash })],
})
export class CreateTemplateForm {
    private templateState = inject(TemplateState);
    private templateLayout = inject(TemplateModalLayoutService);
    router = inject(Router);

    currentTemplate = this.templateState.form;
    templateExercises = this.templateState.templateExercises;

    get nameControl() {
        return this.currentTemplate.get('name') as FormControl;
    }

    constructor() {
        this.templateLayout.setConfig({ title: 'Create Template', showBackButton: true, action: [] });

        effect(() => {
            const tempExercises = this.templateExercises();
            if (!tempExercises || tempExercises.length === 0)
                this.router.navigate(['workout-form/templates/exercises']);
        });
    }

    removeExercise(exerciseId: number) {
        const arr = this.templateState.getTemplateExercises().value as any[];
        const idx = arr.findIndex((e: any) => e.exerciseId === exerciseId);
        if (idx !== -1) arr.splice(idx, 1);
    }

    submit() {
        if (this.currentTemplate.invalid) {
            this.currentTemplate.markAllAsTouched();
            return;
        }
    }
}
