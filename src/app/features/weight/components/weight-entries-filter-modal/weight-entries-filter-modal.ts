import { Component, computed, effect, input, output, signal, WritableSignal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidXmark } from '@ng-icons/font-awesome/solid';
import { Button } from '@shared';
import { MONTHS } from '../../../../core/models/month';

@Component({
    selector: 'app-weight-entries-filter-modal',
    imports: [NgIcon, Button],
    providers: [provideIcons({ faSolidXmark })],
    templateUrl: './weight-entries-filter-modal.html',
    styleUrl: './weight-entries-filter-modal.css',
})
export class WeightEntriesFilterModal {
    isOpen = input.required<boolean>();
    yearsAndMonthsGroup = input.required<Record<number, number[]> | undefined>();

    closed = output<void>();
    appliedFilters = output<{ year: number; month: number | null }>();
    labels = output<{ year: number; month: string | null }>();
    
    onClose() {
        this.selectedYear.set(null);
        this.selectedMonth.set(null);
        this.closed.emit();
    }

    onApply() {
        const year = this.selectedYearParam();
        const month = this.selectedMonthParam();

        if (year !== null) {
            this.appliedFilters.emit({ year, month });
        }
    }
    
    onLabelChange() {
        this.labels.emit({ year: this.selectedYearParam()!, month: this.monthLabel() });
    }

    selectedYear: WritableSignal<number | null> = signal(null);
    selectedMonth: WritableSignal<number | null> = signal(null);

    constructor() {
        effect(() => {
            this.onLabelChange();
        });
    }

    yearLabel = computed(() => this.selectedYearParam());
    monthLabel = computed(() => this.months[this.selectedMonthParam()!]);

    availableYears = computed(() => {
        const yearsAndMonthsGroup = this.yearsAndMonthsGroup();

        if (!yearsAndMonthsGroup) return [];

        return Object.keys(yearsAndMonthsGroup)
            .map(Number)
            .sort((a, b) => b - a);
    });

    availableMonths = computed(() => {
        const year = this.selectedYear();
        const yearsAndMonthsGroup = this.yearsAndMonthsGroup();

        if (!yearsAndMonthsGroup) return [];

        const firstYear = this.availableYears()[0];
        const months = yearsAndMonthsGroup[year ? year : Number(firstYear)] ?? [];

        return months.slice().sort((a, b) => b - a);
    });

    selectedYearParam = computed(() => {
        const selYear = this.selectedYear();
        const availYears = this.availableYears();

        if (selYear !== null && availYears.includes(selYear)) {
            return selYear;
        }

        return availYears.length > 0 ? Number(availYears[0]) : null;
    });

    selectedMonthParam = computed(() => {
        const selMonth = this.selectedMonth();
        const availMonths = this.availableMonths();

        if (selMonth !== null && availMonths.includes(selMonth)) {
            return selMonth;
        }

        return availMonths.length > 0 ? Number(availMonths[0]) : null;
    });

    months = MONTHS
}
