import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { WeightState } from '@features/weight/services/weight-state';
import { createWeightEntryForm } from '@features/weight/factories/weight-form-factories';
import { NotificationService } from '../../../../core/services/notification-service';
import { isControlValid } from '../../../../core/helpers/form-helpers';
import { NgIcon } from '@ng-icons/core';
import { Button } from '@shared';
import { WeightEntryService } from '@features/weight/services/weight-entry-service';

const SUCCESS_MESSAGES = [
    'Weight logged! Consistency is what brings results.',
    'Weight logged successfully! Keep up the good work.',
    'Great job tracking your progress today!',
    'Log saved! Every entry gets you closer to your goal.',
    'Weight updated. Keep showing up for yourself!',
    'Consistency is key! Weight successfully updated.',
];

const TARGET_REACHED_MESSAGES = [
    'Well done! You\'ve reached your target weight!',
    'Target weight reached! Outstanding achievement!',
    "Goal unlocked! You've officially hit your target weight!",
];

@Component({
    selector: 'app-quick-log',
    imports: [ReactiveFormsModule, NgIcon, Button],
    templateUrl: './quick-log.html',
    styleUrl: './quick-log.css',
})
export class QuickLog {
    isControlValid = isControlValid;

    fb = inject(FormBuilder);
    weightService = inject(WeightEntryService);
    weightState = inject(WeightState);
    notificationService = inject(NotificationService);

    isPending = this.weightService.addWeightEntryMutation.isPending;

    form = createWeightEntryForm(this.fb);

    onSubmit() {
        if (this.form.invalid) return;

        this.weightService.addWeightEntryMutation.mutate(this.form.value, {
            onSuccess: (res) => {
                this.form.reset();
                const targetWeight = this.weightState.targetWeight();
                const currentWeight = res.weight;
                this.notificationService.showSuccess(this.getWeightEntrySavedMessage(targetWeight, currentWeight));
            },
            onError: (err) => {
                if (err.errorCode === 'WeightEntry.LimitReached')
                    this.notificationService.showInfo('You can only log weight once per day');
            },
        });
    }

    private getWeightEntrySavedMessage(targetWeight: number | null, currentWeight: number): string {
        if (targetWeight === null || targetWeight !== currentWeight)
            return SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)];
        
        return TARGET_REACHED_MESSAGES[Math.floor(Math.random() * TARGET_REACHED_MESSAGES.length)];
    }
}
