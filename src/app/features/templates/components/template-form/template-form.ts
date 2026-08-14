import { Component, computed, effect, inject, signal, Signal } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { isControlValid } from '../../../../core/helpers/form-helpers';
import { NotificationService } from '../../../../core/services/notification-service';
import { ModalData, ModalType, Button, Modal } from '@shared';
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
    private notificationService = inject(NotificationService);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    isEdit: Signal<boolean> = computed(() => this.activatedRoute.snapshot.data['mode'] === 'edit')

    currentTemplate = this.templateState.form;
    templateExercises = this.templateState.templateExercises;
    templateName = this.templateState.templateName;
    templateNotes = this.templateState.templateNotes;
    isFormValid = this.templateState.isFormValid;
    isSaving = computed(() => this.templateService.createTemplateMutation.isPending() || this.templateService.updateTemplateMutation.isPending());
    isDeleting = this.templateService.deleteTemplateMutation.isPending;
    isModalOpen = signal(false);

    get nameControl(): AbstractControl { return this.currentTemplate.get('name')!; }
    get notesControl(): AbstractControl { return this.currentTemplate.get('notes')!; }

    isControlValid = isControlValid;

    constructor() {

        effect(() => {
            const isEdit = this.isEdit();
            let title = isEdit ? "Edit Template" : "Create Template";

            this.templateLayout.setConfig({ title: title, showBackButton: true, action: [] });

        })

        effect(() => {
            const tempExercises = this.templateExercises();
            const redirectPath = this.isEdit()
            ? `workouts/create/templates/details/${this.activatedRoute.snapshot.paramMap.get('id')}`
            : "workouts/create/templates/exercises";

            if (!tempExercises || tempExercises.length === 0)
                this.router.navigate([redirectPath]);
        });
    }

    goToExercises = () => this.router.navigate(['workouts/create/templates/exercises']);

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
        this.templateService.createTemplateMutation.mutate(request, {
            onSuccess: () => {
                this.notificationService.showSuccess('Template created successfully!');
                this.templateState.clearForm();
                this.router.navigate(['workouts/create/templates'])
            },
            onError: (err) => {
                switch(err.errorCode) {
                    case "WorkoutTemplate.AlreadyExists":
                        this.notificationService.showError("Requested tempate was not found")
                        break;
                    case "WorkoutTemplate.LimitReached":
                        this.notificationService.showError("You reached the limit for adding templates")
                        break;
                    case "Exercise.NotFound":
                        this.notificationService.showError("Some of the requested exercises are not found in the system")
                        break;
                    default:
                        this.notificationService.showError("An error occurred while creating a new template. Try again later");
                }
            }
        });
    }

    updateTemplate(request: TemplateRequest) {
        this.templateService.updateTemplateMutation.mutate(request, {
            onSuccess: () => {
                this.notificationService.showSuccess('Template updated successfully!');
                this.templateState.clearForm();
                this.router.navigate(['workouts/create/templates'])
            },
            onError: (err) => {
                switch(err.errorCode) {
                    case "WorkoutTemplate.AlreadyExists":
                        this.notificationService.showError("Requested tempate was not found")
                        break;
                    case "WorkoutTemplate.NotFound":
                        this.notificationService.showError("Template that you tried to update was not found")
                        break;
                    case "Exercise.NotFound":
                        this.notificationService.showError("Some of the requested exercises are not found in the system")
                        break;
                    default:
                        this.notificationService.showError("An error occurred while trying to update your template. Try again later");
                }
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
        this.templateService.deleteTemplateMutation.mutate(id, {
            onSuccess: () => {
                this.notificationService.showSuccess('Template deleted successfully!');
                this.router.navigate(['workouts/create/templates'])
                this.templateState.clearForm();
            },
            onError: (err) => {
                if(err.errorCode === "WorkoutTemplate.NotFound")
                    this.notificationService.showError("Template that you tried to update was not found")
                else
                    this.notificationService.showError("An error occurred while trying to delete your template. Try again later")
            }
        });
    }
}
