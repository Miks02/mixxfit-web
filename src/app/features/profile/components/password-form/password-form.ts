import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { faSolidCircleInfo, faSolidKey, faSolidLock, faSolidXmark } from "@ng-icons/font-awesome/solid";
import { createChangePasswordForm } from '../../factories/profile-factories';
import { handleValidationErrors, isControlValid } from '../../../../core/helpers/form-helpers';
import { NotificationService } from '../../../../core/services/notification-service';
import { ProfileService } from '../../services/profile-service';
import { AuthService } from '../../../../core/services/auth-service';
import { Button } from '@shared';

@Component({
    selector: 'app-password-form',
    imports: [NgIcon, FormsModule, ReactiveFormsModule, Button],
    templateUrl: './password-form.html',
    styleUrl: './password-form.css',
    providers: [provideIcons({faSolidKey, faSolidLock, faSolidXmark, faSolidCircleInfo})]
})
export class PasswordForm {
    @Output()
    close = new EventEmitter<void>();

    private router = inject(Router);
    private profileService = inject(ProfileService);
    private authService = inject(AuthService);
    private fb = inject(FormBuilder);
    private notificationService = inject(NotificationService);

    form = createChangePasswordForm(this.fb);
    isControlValid = isControlValid;
    isSaving = this.profileService.changePasswordMutation.isPending;

    onClose() {
        this.close.emit();
    }

    onSubmit() {
        if (this.form.invalid) {
            return;
        }

        const newPassword = this.form.get('newPassword')?.value;
        const confirmPassword = this.form.get('confirmPassword')?.value;

        if (newPassword !== confirmPassword) {
            this.form.get('confirmPassword')?.setErrors({ mismatch: true });
            this.notificationService.showWarning('Passwords do not match');
            return;
        }

        this.profileService.changePasswordMutation.mutate(this.form.value, {
            onSuccess: () => {
                this.notificationService.showSuccess("Password changed successfully")
                this.authService.clearAuthData();
                this.router.navigate(['/login']);
            },
            onError: (err) => {
                handleValidationErrors(err, this.form);

                if (err.errorCode === 'User.InvalidPassword' || err.errorCode === 'Auth.InvalidCurrentPassword') {
                    this.form.get('currentPassword')?.setErrors({ invalid: true });
                    this.notificationService.showError('Current password is incorrect');
                } else if (err.errorCode === 'Auth.PasswordTooShort') {
                    this.form.get('newPassword')?.setErrors({ tooShort: true });
                    this.notificationService.showError('Password is too short');
                } else if (err.errorCode === 'Auth.PasswordRequiresDigit') {
                    this.form.get('newPassword')?.setErrors({ requiresDigit: true });
                    this.notificationService.showError('Password must contain at least one digit');
                } else if (err.errorCode === 'Auth.PasswordRequiresUpper') {
                    this.form.get('newPassword')?.setErrors({ requiresUpper: true });
                    this.notificationService.showError('Password must contain at least one uppercase letter');
                } else if (err.errorCode === 'Auth.PasswordRequiresNonAlphanumeric') {
                    this.form.get('newPassword')?.setErrors({ requiresNonAlphanumeric: true });
                    this.notificationService.showError('Password must contain at least one special character');
                } else {
                    this.notificationService.showError('Failed to change password');
                }
            }
        })

    }
}
