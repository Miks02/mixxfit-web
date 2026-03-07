import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { onlyNumbersCheck } from "../../../core/helpers/FormHelpers";


export function createWeightEntryForm(fb: FormBuilder): FormGroup {
    return fb.group({
        weight: ['', [Validators.required, Validators.min(24), Validators.max(399), onlyNumbersCheck()]],
        time: ['', Validators.required],
        notes: ['', Validators.maxLength(100)]
    });
}

export function createTargetWeightForm(fb: FormBuilder): FormGroup {
    return fb.group({
        targetWeight: ['', [Validators.required, Validators.min(24), Validators.max(399), onlyNumbersCheck()]]
    })
}
