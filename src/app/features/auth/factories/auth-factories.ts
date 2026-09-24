import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';

export function createForgotPasswordForm(fb: FormBuilder) {
    return fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
    });
}

export function createResetPasswordForm(fb: FormBuilder) {
    return fb.nonNullable.group(
        {
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmedPassword: ['', [Validators.required]],
        },
        { validators: [passwordMatchValidator] },
    );
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmedPassword = control.get('confirmedPassword');

    if (!password || !confirmedPassword) {
        return null;
    }

    return password.value === confirmedPassword.value ? null : { passwordMismatch: true };
}
