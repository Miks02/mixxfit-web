import { Component, computed, effect, inject, signal, Signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { finalize, take } from 'rxjs';
import { ModalData } from '../../../../core/models/modal-data';
import { ModalType } from '../../../../core/models/modal-type';
import { NotificationService } from '../../../../core/services/notification-service';
import { Button } from '../../../../shared/button/button';
import { Modal } from '../../../../layout/utilities/modal/modal';
import { createTemplateRequestFromForm, mapTemplateExercises } from '../../factories/template-factories';
import { TemplateRequest } from '../../models/template-request';
import { TemplateModalLayoutService } from '../../services/template-modal-layout-service';
import { TemplateService } from '../../services/template-service';
import { TemplateState } from '../../services/template-state';

@Component({
    selector: 'app-template-form',
    imports: [NgIcon, FormsModule, ReactiveFormsModule, Button, Modal],
    templateUrl: './template-form.html',
    styleUrl: './template-form.css',
    providers: [provideIcons({ faSolidDumbbell, faSolidPersonRunning, faSolidChildReaching, faSolidPersonWalkingArrowLoopLeft, faSolidTrash, faSolidTag, faSolidNoteSticky })],
})
export class TemplateForm {
    templateState = inject(TemplateState);
    private templateLayout = inject(TemplateModalLayoutService);
    private templateService = inject(TemplateService);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private notificationService = inject(NotificationService);

    isEdit: Signal<boolean> = computed(() => this.activatedRoute.snapshot.data['mode'] === 'edit')

    currentTemplate = this.templateState.form;
    templateExercises = this.templateState.templateExercises;
    templateName = this.templateState.templateName;
    templateNotes = this.templateState.templateNotes;
    isFormValid = this.templateState.isFormValid;
    isLoading = signal(false);
    isModalOpen = signal(false);

    constructor() {

        effect(() => {
            const isEdit = this.isEdit();
            let title = isEdit ? "Edit Template" : "Create Template";

            this.templateLayout.setConfig({ title: title, showBackButton: true, action: [] });

        })

        effect(() => {
            const tempExercises = this.templateExercises();
            const redirectPath = this.isEdit()
            ? `workout-form/templates/details/${this.activatedRoute.snapshot.paramMap.get('id')}`
            : "workout-form/templates/exercises";

            if (!tempExercises || tempExercises.length === 0)
                this.router.navigate([redirectPath]);
        });
    }

    goToExercises = () => this.router.navigate(['workout-form/templates/exercises']);

    removeExercise = () => this.templateState.removeExerciseFromTemplate;

    submit() {
        if (this.currentTemplate.invalid) {
            this.currentTemplate.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);

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
            take(1),
            finalize(() => this.isLoading.set(false))
        )
        .subscribe({
            next: () => {
                this.notificationService.showSuccess("Template created successfully!")
                this.templateState.clearForm();
                this.router.navigate(['workout-form/templates'])

            },
            error: () => {
                this.notificationService.showError("Error happened while trying to create a template, try again later");
            }
        });
    }

    updateTemplate(request: TemplateRequest) {
        this.templateService.updateTemplate(request).pipe(
            take(1),
            finalize(() => this.isLoading.set(false))
        )
        .subscribe({
            next: () => {
                this.notificationService.showSuccess("Template updated successfully!")
                this.templateState.clearForm();
                this.router.navigate(['workout-form/templates'])

            },
            error: () => {
                this.notificationService.showError("Error happened while trying to create a template, try again later");
            }
        });
    }

    openDeleteModal() {
        this.isModalOpen.set(true);
    }

    closeModal() {
        this.isModalOpen.set(false);
    }

    buildModal(): ModalData {
        return {
            title: 'Delete Template',
            subtitle: 'Are you sure you want to delete this template? This action cannot be undone.',
            type: ModalType.Warning,
            primaryActionLabel: 'Delete',
            secondaryActionLabel: 'Cancel',
            primaryAction: () => {
                this.closeModal();
                this.deleteTemplate(this.templateState.templateId()!);
            },
            secondaryAction: () => this.closeModal()
        };
    }

      deleteTemplate(id: number) {
        this.isLoading.set(true);
        this.templateService.deleteTemplate(id).pipe(
            take(1),
            finalize(() => this.isLoading.set(false))
        )
        .subscribe({
            next: () => {
                this.notificationService.showSuccess("Template has been deleted successfully");
                this.router.navigate(['workout-form/templates'])
                this.templateState.clearForm();
            },
            error: () => {
                this.notificationService.showError("Error occurred while trying to delete the template");
            }
        })
    }
}
