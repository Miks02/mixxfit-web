import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { WeightState } from '@features/weight/services/weight-state';
import { createWeightEntryForm } from '@features/weight/factories/weight-form-factories';
import { NotificationService } from '../../../../core/services/notification-service';
import { isControlValid } from '../../../../core/helpers/form-helpers';
import { NgIcon } from '@ng-icons/core';
import { Button } from '@shared';
import { WeightEntryService } from '@features/weight/services/weight-entry-service';

@Component({
    selector: 'app-quick-log',
    imports: [ReactiveFormsModule, NgIcon, Button],
    templateUrl: './quick-log.html',
    styleUrl: './quick-log.css',
})
export class QuickLog {
    isControlValid = isControlValid;

    fb = inject(FormBuilder);
    weightService = inject(WeightEntryService)
    notificationService = inject(NotificationService);

    isPending = this.weightService.addWeightEntryMutation.isPending;

    form = createWeightEntryForm(this.fb);

    onSubmit() {
        if (this.form.invalid) return;

        this.weightService.addWeightEntryMutation.mutate(this.form.value, {
            onSuccess: () => {
                this.form.reset();
                this.notificationService.showSuccess('Weight entry saved');
            },
            onError: (err) => {
                if (err.errorCode === 'WeightEntry.LimitReached')
                    this.notificationService.showInfo('You can only log weight once per day');
            },
        });
    }
}
