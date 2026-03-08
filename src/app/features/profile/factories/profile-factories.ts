import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export function createFullNameForm(fb: FormBuilder, firstName: string = '', lastName: string = ''): FormGroup {
    return fb.group({
        firstName: [firstName, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        lastName: [lastName, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
    });
}

export function createDateOfBirthForm(fb: FormBuilder, dateOfBirth: string = ''): FormGroup {
    return fb.group({
        dateOfBirth: [dateOfBirth, Validators.required]
    });
}

export function createUsernameForm(fb: FormBuilder, username: string = ''): FormGroup {
    return fb.group({
        userName: [username, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
    });
}

export function createEmailForm(fb: FormBuilder, email: string = ''): FormGroup {
    return fb.group({
        email: [email, [Validators.required, Validators.email]]
    });
}

export function createGenderForm(fb: FormBuilder, gender: number | null = null): FormGroup {
    return fb.group({
        gender: [gender, Validators.required]
    });
}

export function createWeightForm(fb: FormBuilder, weight: number | null = null): FormGroup {
    return fb.group({
        weight: [weight, [Validators.required, Validators.min(24), Validators.max(399)]]
    });
}

export function createHeightForm(fb: FormBuilder, height: number | null = null): FormGroup {
    return fb.group({
        height: [height, [Validators.required, Validators.min(69), Validators.max(249)]]
    });
}

export function createProfilePictureForm(fb: FormBuilder): FormGroup {
    return fb.group({
        profileImage: ['']
    });
}

export function createChangePasswordForm(fb: FormBuilder): FormGroup {
    return fb.group({
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
}
