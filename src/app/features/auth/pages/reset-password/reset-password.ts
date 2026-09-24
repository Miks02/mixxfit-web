import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidKey, faSolidLock } from '@ng-icons/font-awesome/solid';
import { Button } from '@shared';
import { handleValidationErrors } from '../../../../core/helpers/form-helpers';
import { AuthService } from '../../../../core/services/auth-service';
import { NotificationService } from '../../../../core/services/notification-service';
import { createResetPasswordForm } from '../../factories/auth-factories';

@Component({
    selector: 'app-reset-password',
    imports: [NgIcon, RouterLink, ReactiveFormsModule, Button],
    templateUrl: './reset-password.html',
    styleUrl: './reset-password.css',
    providers: [provideIcons({ faSolidKey, faSolidLock })],
})
export class ResetPassword implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly notificationService = inject(NotificationService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);

    private readonly token = this.activatedRoute.snapshot.queryParamMap.get('token');
    private readonly userId = this.activatedRoute.snapshot.queryParamMap.get('userId');

    form = createResetPasswordForm(this.fb);
    isLoading = this.authService.resetPasswordMutation.isPending;

    get password() {
        return this.form.controls.password;
    }

    get confirmedPassword() {
        return this.form.controls.confirmedPassword;
    }

    ngOnInit() {
        // Keep the reset token out of the address bar and browser history.
        history.replaceState(null, '', location.pathname);
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.authService.resetPasswordMutation.mutate(
            { token: this.token!, userId: this.userId!, ...this.form.getRawValue() },
            {
                onSuccess: () => {
                    this.notificationService.showSuccess('Password has been reset successfully.');
                    this.router.navigate(['/login']);
                },
                onError: (err) => {
                    if (err.status === 400 && err.errors) {
                        handleValidationErrors(err, this.form);
                        return;
                    }

                    if (err.status === 400) {
                        this.notificationService.showError('The reset link is invalid or has expired.');
                    }
                },
            },
        );
    }
}
