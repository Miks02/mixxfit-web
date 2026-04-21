import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { onlyNumbersCheck } from "./form-helpers";
import { UnitSystem } from "../../features/nutrition/models/unit-system";
import { ActivityLevel } from "../../features/nutrition/models/activity-level";

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
