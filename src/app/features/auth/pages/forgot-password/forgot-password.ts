import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidEnvelope } from '@ng-icons/font-awesome/solid';
import { Button } from '@shared';
import { AuthService } from '../../../../core/services/auth-service';
import { createForgotPasswordForm } from '../../factories/auth-factories';
import { NotificationService } from '../../../../core/services/notification-service';

@Component({
    selector: 'app-forgot-password',
    imports: [NgIcon, RouterLink, ReactiveFormsModule, Button],
    templateUrl: './forgot-password.html',
    styleUrl: './forgot-password.css',
    providers: [provideIcons({ faSolidEnvelope })],
})
export class ForgotPassword {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly notificationService = inject(NotificationService);

    form = createForgotPasswordForm(this.fb);

    isLoading = this.authService.forgotPasswordMutation.isPending;
    isOnCooldown = this.authService.isOnCooldown;
    cooldownDuration = this.authService.cooldownDuration;

    get email() {
        return this.form.controls.email;
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.isOnCooldown()) return;

        this.authService.forgotPasswordMutation.mutate(this.form.getRawValue(), {
            onSuccess: () =>
                this.notificationService.showInfo(
                    'Request sent! If an account with that email exists, you will receive an email with instructions to reset your password.',
                    12000,
                ),
            onError: (err) => {
                if (err.status === 429) {
                    this.notificationService.showError(`Too many requests. Please wait ${this.cooldownDuration()} seconds before trying again.`, 6000);
                    return;
                }
                this.notificationService.showError('An unexpected error occurred. Please try again later.', 6000);
            }
        });
    }
}
