import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { onlyNumbersCheck } from "./FormHelpers";
import { UnitSystem } from "../../features/nutrition/models/unit-system";
import { ActivityLevel } from "../../features/nutrition/models/activity-level";

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

export function createCalculateCaloriesForm(fb: FormBuilder): FormGroup {
  return fb.group({
      unitSystem: [UnitSystem.Metric],
      age: [null, [Validators.required, Validators.min(1), Validators.max(120), onlyNumbersCheck()]],
      gender: [null, [Validators.required]],
      weightKg: [null, [Validators.min(25), Validators.max(500), onlyNumbersCheck()]],
      weightLbs: [1, [Validators.min(1), Validators.max(1100), onlyNumbersCheck()]],
      heightCm: [null, [Validators.min(50), Validators.max(300), onlyNumbersCheck()]],
      heightFt: [null, [Validators.min(1), Validators.max(10), onlyNumbersCheck()]],
      heightIn: [0, [Validators.min(0), Validators.max(11), onlyNumbersCheck()]],
      activityLevel: [ActivityLevel.Moderate, [Validators.required]]
    });
}
