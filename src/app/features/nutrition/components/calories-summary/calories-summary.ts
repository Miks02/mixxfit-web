import { Component, computed, input, model, output, signal } from '@angular/core';
import { CalorieResult } from '../../models/calorie-result';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { faSolidArrowDown, faSolidArrowLeft, faSolidArrowUp, faSolidBoltLightning, faSolidCalculator, faSolidCheck, faSolidFireFlameCurved, faSolidHourglass, faSolidMinus, faSolidPerson, faSolidRulerVertical, faSolidScaleUnbalanced, faSolidXmark } from '@ng-icons/font-awesome/solid';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../../shared/button/button';

@Component({
  selector: 'app-calories-summary',
  imports: [NgIcon, FormsModule, Button],
  templateUrl: './calories-summary.html',
  styleUrl: './calories-summary.css',
  providers: [provideIcons({
    faSolidXmark, faSolidCalculator, faSolidFireFlameCurved,
    faSolidScaleUnbalanced, faSolidPerson, faSolidRulerVertical,
    faSolidHourglass, faSolidBoltLightning, faSolidArrowDown,
    faSolidArrowUp, faSolidMinus, faSolidCheck, faSolidArrowLeft
  })]
})
export class CaloriesSummary {
    result = input.required<CalorieResult>();

    back = output<void>();
    updateDailyCalories = output<number>();

    selectedCalorieValue = model<number | null>(null);

    onBack() {
        this.back.emit();
    }

    onUpdateDailyCalories() {
        const calories = this.selectedCalorieValue();
        if(!calories)
            return;

        this.updateDailyCalories.emit(calories);
    }

    setSelectedCalories(calories: number) {
        this.selectedCalorieValue.set(calories);
    }

    areCaloriesValid = computed(() => {
        const calories = this.selectedCalorieValue();
        return calories !== null && (calories > 1000 && calories < 10000);
    });


}
