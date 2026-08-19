import { Component, inject, input, output } from '@angular/core';
import { createTargetWeightForm } from '@features/weight/factories/weight-form-factories';
import { isControlValid } from '../../../../core/helpers/form-helpers';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { WeightEntryService } from '@features/weight/services/weight-entry-service';
import { NotificationService } from '../../../../core/services/notification-service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidBullseye, faSolidCheck, faSolidTrash } from '@ng-icons/font-awesome/solid';
import { Button } from '@shared';

@Component({
    selector: 'app-set-target-form',
    imports: [NgIcon, ReactiveFormsModule, Button],
    providers: [
        provideIcons({
            faSolidBullseye,
            faSolidCheck,
            faSolidTrash,
        }),
    ],
    templateUrl: './set-target-form.html',
    styleUrl: './set-target-form.css',
})
export class SetTargetForm {
    isOpen = input.required<boolean>();
    targetWeight = input.required<number | null | undefined>();

    closed = output<void>();

    fb = inject(FormBuilder);
    weightService = inject(WeightEntryService);
    notificationService = inject(NotificationService);

    targetForm = createTargetWeightForm(this.fb);
    isControlValid = isControlValid;

    isPending = this.weightService.updateTargetWeightMutation.isPending;

    onClose() {
        this.targetForm.reset();
        this.closed.emit();
    }

    onSet() {
        this.weightService.updateTargetWeightMutation.mutate(this.targetForm.value, {
            onSuccess: () => {
                this.onClose();
                this.notificationService.showSuccess('Target weight updated successfully.');
            },
            onError: () => {
                this.notificationService.showError(
                    'Failed to update target weight. Please try again',
                );
            },
        });
    }

    onClear() {
        this.weightService.updateTargetWeightMutation.mutate(
            { targetWeight: null },
            {
                onSuccess: () => {
                    this.onClose();
                    this.notificationService.showSuccess('Target weight cleared successfully.');
                    this.targetForm.reset();
                },
                onError: () => {
                    this.notificationService.showError(
                        'Failed to clear target weight. Please try again',
                    );
                },
            },
        );
    }
}
