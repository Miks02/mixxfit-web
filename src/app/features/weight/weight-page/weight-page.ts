import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { WeightChart } from "../../misc/weight-chart/weight-chart";
import { LayoutState } from '../../../layout/services/layout-state';
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
    faSolidBullseye,
    faSolidChartLine,
    faSolidChevronLeft,
    faSolidChevronRight,
    faSolidClock,
    faSolidGhost,
    faSolidMagnifyingGlassChart,
    faSolidNoteSticky,
    faSolidScaleUnbalanced,
    faSolidWeightScale
} from "@ng-icons/font-awesome/solid";
import { FormBuilder, ReactiveFormsModule, AbstractControl, FormsModule } from '@angular/forms';
import { createWeightEntryForm, createTargetWeightForm } from '../../../core/helpers/Factories';
import { WeightEntryService } from '../services/weight-entry-service';
import { take } from 'rxjs';
import { NotificationService } from '../../../core/services/notification-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe, SlicePipe } from "@angular/common";
import { UserService } from '../../../core/services/user-service';
import { isControlValid } from '../../../core/helpers/FormHelpers';
import { ModalData } from '../../../core/models/ModalData';
import { ModalType } from '../../../core/models/ModalType';
import { WeightEntryDetails } from '../models/weight-entry-details';
import { Modal } from "../../../layout/utilities/modal/modal";
import { formatDate } from '../../../core/helpers/Utility';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { UserState } from '../../../core/states/user-state';

@Component({
    selector: 'app-weight-page',
    imports: [WeightChart, NgIcon, ReactiveFormsModule, ReactiveFormsModule, DatePipe, DecimalPipe, SlicePipe, Modal, FormsModule, NgxSkeletonLoaderComponent],
    templateUrl: './weight-page.html',
    styleUrl: './weight-page.css',
    providers: [provideIcons({faSolidScaleUnbalanced, faSolidBullseye, faSolidMagnifyingGlassChart, faSolidClock, faSolidWeightScale, faSolidNoteSticky, faSolidGhost, faSolidChevronLeft, faSolidChevronRight, faSolidChartLine})]
})
export class WeightPage  {
    isControlValid = isControlValid

    private layoutState = inject(LayoutState);
    private weightService = inject(WeightEntryService);
    private userService = inject(UserService);
    private userState = inject(UserState);
    private fb = inject(FormBuilder);
    private notificationService = inject(NotificationService);

    isModalOpen = signal(false);
    selectedWeightEntry: WritableSignal<WeightEntryDetails | null> = signal(null);
    user = this.userState.userDetails;
    weightSummary = this.weightService.weightSummary;
    weightListDetails = this.weightService.weightListDetails;

    form = createWeightEntryForm(this.fb);
    targetWeightForm = createTargetWeightForm(this.fb);
    isTargetFormOpen = signal(false);
    isEditingTarget = computed(() => this.isTargetFormOpen())

    selectedYear: WritableSignal<number | null> = signal(null);
    selectedMonth: WritableSignal<number | null> = signal(null);

    months = computed(() => this.weightListDetails()?.months);
    years = computed(() => this.weightSummary()?.years);

    weightLogs = computed(() => this.weightListDetails()?.weightLogs);
    firstEntry = computed(() => this.weightSummary()?.firstEntry);
    currentWeight = computed(() => this.weightSummary()?.currentWeight);
    progress = computed(() => this.weightSummary()?.progress);
    targetWeight = computed(() => this.user()?.targetWeight);
    weightChart = computed(() => this.weightSummary()?.weightChart!);

    ngOnInit() {
        this.layoutState.setTitle("Weight Tracking");
        this.loadWeightSummary();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            const elements = document.querySelectorAll('.typewriter');
            elements.forEach((el: any) => {
                el.style.setProperty('--target-width', el.scrollWidth + 'px');
            });
        }, 100);
    }

    loadWeightSummary() {
        return this.weightService.getMyWeightSummary(this.selectedMonth(), this.selectedYear(), this.targetWeight())
        .pipe(take(1))
        .subscribe()
    }

    loadWeightLogs() {
      console.warn(this.selectedMonth() + "yar")
        return this.weightService.getMyWeightLogs(this.selectedMonth(), this.selectedYear())
        .pipe(take(1))
        .subscribe()
    }

    loadWeightChart(targetWeight: number | null = null) {
        return this.weightService.getMyWeightChart(targetWeight ?? this.targetWeight())
        .pipe(take(1))
        .subscribe()
    }

    onSubmit() {
        if(this.form.invalid)
            return;

        this.weightService.addWeightEntry(this.form.value)
        .pipe(take(1))
        .subscribe({
            next: () => {
                this.form.reset();
                this.notificationService.showSuccess("Weight logged successfully");
                this.loadWeightSummary();
            },
            error: (err) => {
                if(err.error.errorCode === "General.LimitReached")
                    this.notificationService.showInfo("You can only log weight once per day")
            }
        });

    }

    enableTargetWeightEdit() {
        if(this.isTargetFormOpen()) {
            this.isTargetFormOpen.set(false);
            return;
        }

        this.isTargetFormOpen.set(true);
        const current = this.targetWeight();
        if(current) {
            this.targetWeightForm.patchValue({targetWeight: current});
        }
    }

    saveTargetWeight() {
        if(this.targetWeightForm.invalid)
            return;

        this.userService.updateTargetWeight(this.targetWeightForm.value)
        .pipe(take(1))
        .subscribe({
            next: (res) => {
                this.notificationService.showSuccess("Target weight updated successfully");
                this.isTargetFormOpen.set(false);
                this.loadWeightChart(res);
            }
        });
    }

    cancelTargetWeightEdit() {
        this.isTargetFormOpen.set(false);
        this.targetWeightForm.reset();
    }

    getTargetWeightMessage() {
        if(this.targetWeight() === this.currentWeight()?.weight)
            return "You have reached your goal, well done!";
        return "Keep going you can do it!";
    }

    loadWeightEntry(id: number) {
        return this.weightService.getMyWeightLog(id)
        .pipe(take(1))
        .subscribe((res) => {
            this.selectedWeightEntry.set(res)
            this.isModalOpen.set(true);
        })

    }

    deleteWeightEntry() {
        if(!this.selectedWeightEntry())
            return;

        return this.weightService.deleteWeightEntry(this.selectedWeightEntry()?.id!)
        .pipe(take(1))
        .subscribe(() => {
            this.loadWeightSummary()
            this.isModalOpen.set(false);
            this.notificationService.showSuccess("Weight log has been deleted successfully")
        })
    }

    closeModal() {
        this.isModalOpen.set(false);
    }

    buildModal(): ModalData {
        const entry = this.selectedWeightEntry();
        const entryDate = formatDate(entry?.createdAt!)
        const notes = entry?.notes ? `| ${entry.notes}` : ""

        return {
            title: `${entry?.weight} KG | ${entry?.time.substring(0, 5)} | ${entryDate} ${notes}`,
            subtitle: `${entry?.notes}\nYou are about to delete this weight entry. This action cannot be undone.`,
            type: ModalType.Warning,
            primaryActionLabel: 'Confirm',
            secondaryActionLabel: 'Close',
            primaryAction: () => this.deleteWeightEntry(),
            secondaryAction: () => this.isModalOpen.set(false)
        };
    }

    convertMonthNumberToString(month: number): string {
        switch(month) {
            case 1: return "January";
            case 2: return "February";
            case 3: return "March";
            case 4: return "April";
            case 5: return "May";
            case 6 :return "June";
            case 7: return "July";
            case 8: return "August";
            case 9: return "September";
            case 10: return "October";
            case 11: return "November";
            case 12: return "December";
            default:
            return "Undefined"
        }
    }


}
