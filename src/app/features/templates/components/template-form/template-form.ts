import { Component, computed, effect, inject, Signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    faSolidChildReaching,
    faSolidDumbbell,
    faSolidNoteSticky,
    faSolidPersonRunning,
    faSolidPersonWalkingArrowLoopLeft,
    faSolidTag,
    faSolidTrash,
} from '@ng-icons/font-awesome/solid';
import { take } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification-service';
import { Button } from '../../../../shared/button/button';
import { createTemplateRequestFromForm, mapTemplateExercises } from '../../factories/template-factories';
import { TemplateRequest } from '../../models/template-request';
import { TemplateModalLayoutService } from '../../services/template-modal-layout-service';
import { TemplateService } from '../../services/template-service';
import { TemplateState } from '../../services/template-state';

@Component({
    selector: 'app-template-form',
    imports: [NgIcon, FormsModule, ReactiveFormsModule, Button],
    templateUrl: './template-form.html',
    styleUrl: './template-form.css',
    providers: [provideIcons({ faSolidDumbbell, faSolidPersonRunning, faSolidChildReaching, faSolidPersonWalkingArrowLoopLeft, faSolidTrash, faSolidTag, faSolidNoteSticky })],
})
export class TemplateForm {
    templateState = inject(TemplateState);
    private templateLayout = inject(TemplateModalLayoutService);
    private templateService = inject(TemplateService);
    private router = inject(Router);
    private notificationService = inject(NotificationService);

    isEdit: Signal<boolean> = computed(() => this.templateState.templateId() ? true : false)

    currentTemplate = this.templateState.form;
    templateExercises = this.templateState.templateExercises;
    templateName = this.templateState.templateName;
    templateNotes = this.templateState.templateNotes;
    isFormValid = this.templateState.isFormValid;

    constructor() {

        effect(() => {
            const isEdit = this.isEdit();
            let title = "Create Template";

            if(isEdit)
                title = "Edit Template"

            this.templateLayout.setConfig({ title: title, showBackButton: true, action: [] });

        })

        effect(() => {
            const tempExercises = this.templateExercises();
            if (!tempExercises || tempExercises.length === 0)
                this.router.navigate(['workout-form/templates/exercises']);
        });
    }

    removeExercise = () => this.templateState.removeExerciseFromTemplate;

    submit() {
        if (this.currentTemplate.invalid) {
            this.currentTemplate.markAllAsTouched();
            return;
        }

        const mappedExercises = mapTemplateExercises(this.templateExercises())
        const request = createTemplateRequestFromForm(this.templateName(), mappedExercises, this.templateNotes(), this.templateState.templateId())

        if(this.isEdit()) {
            this.updateTemplate(request);
            return;
        }

        this.createTemplate(request);
    }

    createTemplate(request: TemplateRequest) {

        this.templateService.addTemplate(request).pipe(
            take(1)
        )
        .subscribe({
            next: () => {
                this.notificationService.showSuccess("Template created successfully!")
                this.templateState.clearForm();
                this.router.navigate(['workout-form/templates'])

            },
            error: () => this.notificationService.showError("Error happened while trying to create a template, try again later")
        });
    }

    updateTemplate(request: TemplateRequest) {
        this.templateService.updateTemplate(request).pipe(
            take(1)
        )
        .subscribe({
            next: () => {
                this.notificationService.showSuccess("Template updated successfully!")
                this.templateState.clearForm();
                this.router.navigate(['workout-form/templates'])

            },
            error: () => this.notificationService.showError("Error happened while trying to create a template, try again later")
        });
    }
}
