import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ProblemDetails } from '../../../core/models/problem-details';
import { UserState } from '../../../core/states/user-state';
import { CreateWeightRequest } from '../models/weight-create-request';
import { WeightEntryDetails } from '../models/weight-entry-details';
import { WeightEntryService } from './weight-entry-service';
import { MONTHS } from '../../../core/models/month';

@Injectable()
export class WeightState {
    months = MONTHS;
    private weightService = inject(WeightEntryService);
    private userState = inject(UserState);

    user = this.userState.userDetails;
    targetWeight = computed(() => this.user()?.targetWeight ?? null);

    filterParams: WritableSignal<{ year: number | null; month: number | null }> = signal({
        year: null,
        month: null,
    });

    weightSummaryQuery = this.weightService.weightSummaryQuery(
        this.filterParams,
        this.targetWeight,
    );
    weightLogsQuery = this.weightService.weightListDetailsQuery(
        this.filterParams,
        this.weightSummaryQuery,
    );

    weightSummary = this.weightSummaryQuery.data;
    isLoading = this.weightSummaryQuery.isLoading;
    isError = this.weightSummaryQuery.isError;
    error = this.weightSummaryQuery.error;

    weightLogs = computed(() => this.weightLogsQuery.data()?.weightLogs);
    yearsAndMonthsGroup = computed(() => this.weightSummary()?.yearsAndMonthsGroup);

    currentWeight = computed(() => {
        const currentWeight = this.weightSummary()?.currentWeight;
        if (!currentWeight) return 'Not set';
        return `${currentWeight.weight} kg`;
    });

    currentWeightCreatedAt = computed(() => {
        const currentWeight = this.weightSummary()?.currentWeight;
        if (!currentWeight) return 'Not available';
        return currentWeight.createdAt;
    });

    weightDelta = computed(() => {
        const weightDelta = this.weightSummary()?.weightDelta;

        if (!weightDelta) return '';
        let weightLabel = 'kg';
        if (weightDelta?.delta > 1 || weightDelta?.delta < -1) weightLabel = "kg's";

        if (weightDelta.delta < 0) {
            return `${-weightDelta.delta} ${weightLabel} lost since ` + weightDelta.createdAt;
        }
        return `${weightDelta.delta} ${weightLabel} gained since ` + weightDelta.createdAt;
    });

    weightChart = computed(() => this.weightSummary()?.weightChart);

    targetWeightDescription = computed(() => {
        const targetWeight = this.targetWeight();
        if (!targetWeight) return 'Not set';
        return `${targetWeight} kg`;
    });

    progress = computed(() => {
        const targetWeight = this.targetWeight();
        const currentWeight = this.weightSummary()?.currentWeight;

        if (!targetWeight) return 'Set your target';
        if (!currentWeight) return '';

        const weightLeft =
            targetWeight > currentWeight?.weight
                ? targetWeight - currentWeight.weight
                : currentWeight?.weight - targetWeight;

        if (weightLeft === 0) return 'Congratulations!';

        return `${+weightLeft.toPrecision(1)} kg left to reach target`;
    });

    targetWeightMessage = computed(() => {
        const currentWeight = this.weightSummary()?.currentWeight?.weight;
        if (!this.targetWeight() || !currentWeight) return '';
        if (this.targetWeight() === currentWeight) {
            return 'Target reached, well done!';
        }
        return 'Keep going you can do it!';
    });

    noWeightLogsMessage = computed(() => {
        const logs = this.weightLogs();
        const selectedYear = this.filterParams().year;
        const selectedMonth = this.filterParams().month;

        if (!logs) return null;

        if (logs.length > 0) return null;

        if (!selectedYear && !selectedMonth)
            return 'Add your first weight log and start tracking your journey.';

        return `No logs found for ${this.months[selectedMonth!]} ${selectedYear}. Update your filters or add a new log.`;
    });

    setFilters(filters: { year: number | null; month: number | null }) {
        this.filterParams.set(filters);
    }

    isAddWeightEntryPending = this.weightService.addWeightEntryMutation.isPending;
    isDeleteWeightEntryPending = this.weightService.deleteWeightEntryMutation.isPending;

    addWeightEntry(
        request: CreateWeightRequest,
        options?: {
            onSuccess?: (data: WeightEntryDetails) => void;
            onError?: (err: ProblemDetails) => void;
        },
    ) {
        this.weightService.addWeightEntryMutation.mutate(request, {
            onSuccess: (data) => {
                options?.onSuccess?.(data);
            },
            onError: options?.onError,
        });
    }

    deleteWeightEntry(
        id: number,
        options?: {
            onSuccess?: () => void;
            onError?: (err: ProblemDetails) => void;
        },
    ) {
        this.weightService.deleteWeightEntryMutation.mutate(id, {
            onSuccess: () => {
                options?.onSuccess?.();
            },
            onError: options?.onError,
        });
    }
}
