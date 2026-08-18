import { SlicePipe } from '@angular/common';
import { Component, computed, inject, input, output, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WeightRecord } from '@features/weight/models/weight-record';
import { WeightState } from '@features/weight/services/weight-state';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidCalendar, faSolidFilter } from '@ng-icons/font-awesome/solid';
import { Modal, ModalData, ModalType } from '@shared';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { NotificationService } from '../../../../core/services/notification-service';
import { WeightEntriesFilterModal } from '../weight-entries-filter-modal/weight-entries-filter-modal';

@Component({
    selector: 'app-weight-entries',
    imports: [
        ReactiveFormsModule,
        NgxSkeletonLoaderComponent,
        FormsModule,
        NgIcon,
        SlicePipe,
        Modal,
        WeightEntriesFilterModal,
    ],
    providers: [provideIcons({ faSolidCalendar, faSolidFilter })],
    templateUrl: './weight-entries.html',
    styleUrl: './weight-entries.css',
})
export class WeightEntries {
    private weightState = inject(WeightState);
    private notificationService = inject(NotificationService);

    weightLogs = this.weightState.weightLogs;
    yearsAndMonthsGroup = this.weightState.yearsAndMonthsGroup;

    selectedYearLabel: WritableSignal<number | null> = signal(null);
    selectedMonthLabel: WritableSignal<string | null> = signal(null);

    isModalOpen: WritableSignal<boolean> = signal(false);
    isFilterModalOpen: WritableSignal<boolean> = signal(false);
    selectedWeightEntry: WritableSignal<WeightRecord | null> = signal(null);

    appliedFilters = output<{ year: number | null; month: number | null }>();

    loadWeightEntry(id: number) {
        const logs = this.weightLogs();

        const selectedLog = logs?.find((l) => l.id == id);
        if (!selectedLog) {
            this.notificationService.showError('Requested weight log not found. Please try again');
            return;
        }
        this.selectedWeightEntry.set(selectedLog);
        this.isModalOpen.set(true);
    }

    deleteWeightEntry() {
        const selected = this.selectedWeightEntry();
        if (!selected) return;

        this.weightState.deleteWeightEntry(selected.id, {
            onSuccess: () => {
                this.isModalOpen.set(false);
                this.notificationService.showSuccess('Weight log has been deleted successfully');
            },
        });
    }

    buildModal = computed((): ModalData => {
        const entry = this.selectedWeightEntry();

        return {
            title: `${entry?.weight} KG | ${entry?.timeLogged.substring(0, 5)} | ${entry?.createdAt}`,
            subtitle: `You are about to delete this weight entry. This action cannot be undone.`,
            type: ModalType.Warning,
            primaryActionLabel: 'Confirm',
            secondaryActionLabel: 'Close',
            primaryAction: () => this.deleteWeightEntry(),
            secondaryAction: () => this.isModalOpen.set(false),
        };
    });

    openFilterModal = () => {
        this.isFilterModalOpen.set(true);
    };

    closeFilterModal = () => {
        this.isFilterModalOpen.set(false);
    };

    applyFilters = (filters: { year: number; month: number | null }) => {
        this.weightState.setFilters(filters);
        this.isFilterModalOpen.set(false);
        this.appliedFilters.emit(filters);
    };

    setLabels = (labels: { year: number; month: string | null }) => {
        this.selectedYearLabel.set(labels.year);
        this.selectedMonthLabel.set(labels.month);
    };

}
