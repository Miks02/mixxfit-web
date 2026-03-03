import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  faSolidXmark,
  faSolidCalculator,
  faSolidFireFlameCurved,
  faSolidScaleUnbalanced,
  faSolidPerson,
  faSolidRulerVertical,
  faSolidHourglass,
  faSolidBoltLightning,
  faSolidArrowDown,
  faSolidArrowUp,
  faSolidMinus
} from '@ng-icons/font-awesome/solid';
import { ActivityLevel } from '../models/ActivityLevel';
import { UnitSystem } from '../models/UnitSystem';
import { CalorieResult } from '../models/CalorieResult';
import { Gender } from '../../../core/models/Gender';
import { createCalculateCaloriesForm } from '../../../core/helpers/Factories';
import { NutritionService } from '../services/nutrition-service';
import { SetDailyCaloriesRequest } from '../models/SetDailyCaloriesRequest';
import { isControlValid } from '../../../core/helpers/FormHelpers';

@Component({
  selector: 'app-calorie-calculator',
  imports: [NgIcon, ReactiveFormsModule],
  templateUrl: './calorie-calculator.html',
  styleUrl: './calorie-calculator.css',
  providers: [provideIcons({
    faSolidXmark, faSolidCalculator, faSolidFireFlameCurved,
    faSolidScaleUnbalanced, faSolidPerson, faSolidRulerVertical,
    faSolidHourglass, faSolidBoltLightning, faSolidArrowDown,
    faSolidArrowUp, faSolidMinus
  })]
})
export class CalorieCalculator {
  @Input() initialAge?: number;
  @Input() initialWeight?: number;
  @Input() initialHeight?: number;
  @Input() initialGender?: Gender;

  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private calorieService = inject(NutritionService);
  selectedGender = signal(this.initialGender);

  ActivityLevel = ActivityLevel;
  UnitSystem = UnitSystem;
  isControlValid = isControlValid

  result = signal<CalorieResult | null>(null);

  form: FormGroup = createCalculateCaloriesForm(this.fb);

  get isMetric(): boolean {
    return this.form.get('unitSystem')?.value === UnitSystem.Metric;
  }

  ngOnInit() {
    this.initFromInputs();
  }

  onUnitChange(unit: UnitSystem) {
    const current = this.form.value;
    this.form.patchValue({ unitSystem: unit });
    this.result.set(null);

    if (unit === UnitSystem.Imperial) {
      if (current.weightKg) {
        this.form.patchValue({ weightLbs: Math.round(current.weightKg * 2.2046) });
      }
      if (current.heightCm) {
        const totalInches = Math.round(current.heightCm / 2.54);
        this.form.patchValue({
          heightFt: Math.floor(totalInches / 12),
          heightIn: Math.round(totalInches % 12)
        });
      }
    } else {
      if (current.weightLbs) {
        this.form.patchValue({ weightKg: Math.round(current.weightLbs / 2.2046 * 10) / 10 });
      }
      if (current.heightFt !== null) {
        const totalInches = (current.heightFt || 0) * 12 + (current.heightIn || 0);
        this.form.patchValue({ heightCm: Math.round(totalInches * 2.54) });
      }
    }
  }
  
  calculate() {

    if(this.form.invalid) {
      return;
    }

    let weightKg: number
    let heightCm: number

    if (this.isMetric) {
      weightKg = this.form.get('weightKg')?.value;
      heightCm = this.form.get('heightCm')?.value;
    } else {
      const lbs = this.form.get('weightLbs')?.value;
      const ft = this.form.get('heightFt')?.value || 0;
      const inches = this.form.get('heightIn')?.value || 0;
      weightKg = lbs / 2.2046;
      heightCm = (ft * 12 + inches) * 2.54;
    }

    const request: SetDailyCaloriesRequest = {
      age: this.form.get('age')?.value,
      weight: weightKg,
      height: heightCm,
      gender: this.form.get('gender')?.value,
      activityLevel: this.form.get('activityLevel')?.value
    }

    this.calorieService.calculateCalories(request).subscribe(res => this.result.set(res));
  }

  onClose() {
    this.close.emit();
  }

  private initFromInputs() {
    const patches: Record<string, any> = {};

    if (this.initialAge) patches['age'] = this.initialAge;

    if (this.initialWeight) {
      patches['weightKg'] = this.initialWeight;
      patches['weightLbs'] = Math.round(this.initialWeight * 2.2046);
    }

    if (this.initialHeight) {
      patches['heightCm'] = this.initialHeight;
      const totalInches = Math.round(this.initialHeight / 2.54);
      patches['heightFt'] = Math.floor(totalInches / 12);
      patches['heightIn'] = Math.round(totalInches % 12);

    }

    if(this.initialGender)
      patches['gender'] = this.initialGender;


    this.form.patchValue(patches);
  }
}
