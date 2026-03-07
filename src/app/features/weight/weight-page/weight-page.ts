import { DatePipe, DecimalPipe, SlicePipe } from "@angular/common";
import { afterNextRender, Component, computed, effect, ElementRef, inject, signal, viewChildren, WritableSignal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
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
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { map, take } from 'rxjs';
import { createTargetWeightForm, createWeightEntryForm } from '../../../core/helpers/Factories';
import { isControlValid } from '../../../core/helpers/FormHelpers';
import { formatDate } from '../../../core/helpers/Utility';
import { ModalData } from '../../../core/models/ModalData';
import { ModalType } from '../../../core/models/ModalType';
import { NotificationService } from '../../../core/services/notification-service';
import { UserService } from '../../../core/services/user-service';
import { UserState } from '../../../core/states/user-state';
import { LayoutState } from '../../../layout/services/layout-state';
import { Modal } from "../../../layout/utilities/modal/modal";
import { WeightChart } from "../../misc/weight-chart/weight-chart";
import { WeightEntryDetails } from '../models/weight-entry-details';
import { WeightEntryService } from '../services/weight-entry-service';
import { toSignal } from "@angular/core/rxjs-interop";

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
    private router = inject(Router);
    private activatedroute = inject(ActivatedRoute);

    isModalOpen = signal(false);
    selectedWeightEntry: WritableSignal<WeightEntryDetails | null> = signal(null);
    user = this.userState.userDetails;
    weightSummary = this.weightService.weightSummary;
    weightListDetails = this.weightService.weightListDetails;

    form = createWeightEntryForm(this.fb);
    targetWeightForm = createTargetWeightForm(this.fb);
    isTargetFormOpen = signal(false);

    selectedYear: WritableSignal<number | null> = signal(null);
    selectedMonth: WritableSignal<number | null> = signal(null);

    months = computed(() => this.weightListDetails()?.months);
    years = computed(() => this.weightSummary()?.years);

    weightLogs = computed(() => this.weightListDetails()?.weightLogs);
    firstEntry = computed(() => this.weightSummary()?.firstEntry);
    currentWeight = computed(() => this.weightSummary()?.currentWeight);
    progress = computed(() => this.weightSummary()?.progress);
    targetWeight = computed(() => this.user()?.targetWeight);
    weightChart = computed(() => this.weightSummary()?.weightChart);
    typewriterElements = viewChildren<ElementRef>('typewriter');

    constructor() {
        this.layoutState.setTitle("Weight Tracking");

        effect(() => {
            const month = this.selectedMonth()
            const year = this.selectedYear()

            this.router.navigate([], {
                relativeTo: this.activatedroute,
                queryParams: {
                    month: month,
                    year: year
                },
                queryParamsHandling: 'merge'
            });
        })

        afterNextRender(() => {
            this.typewriterElements().forEach((el: ElementRef) => {
                el.nativeElement.style.setProperty('--target-width', el.nativeElement.scrollWidth + 'px');
            });
        });
    }

    ngOnInit() {
        this.activatedroute.queryParams
        .pipe(take(1))
        .subscribe((params) => {
            this.selectedMonth.set(params['month'] ? +params['month'] : null)
            this.selectedYear.set(params['year'] ? +params['year'] : null)
            this.loadWeightSummary();

        })
    }

    loadWeightSummary() {
        this.weightService.getMyWeightSummary(this.selectedMonth(), this.selectedYear(), this.targetWeight())
        .pipe(take(1))
        .subscribe()
    }

    loadWeightLogs() {
        this.weightService.getMyWeightLogs(this.selectedMonth(), this.selectedYear())
        .pipe(take(1))
        .subscribe()
    }

    loadWeightChart(targetWeight: number | null = null) {
        this.weightService.getMyWeightChart(targetWeight ?? this.targetWeight())
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

    loadWeightEntry(id: number) {
        this.weightService.getMyWeightLog(id)
        .pipe(take(1))
        .subscribe((res) => {
            this.selectedWeightEntry.set(res)
            this.isModalOpen.set(true);
        })

    }

    deleteWeightEntry() {
        let selected = this.selectedWeightEntry();
        if(!selected)
            return;

        this.weightService.deleteWeightEntry(selected.id)
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

    getTargetWeightMessage = computed(() => {
        if(this.targetWeight() === this.currentWeight()?.weight)
            return "You have reached your goal, well done!";
        return "Keep going you can do it!";
    })

    buildModal = computed((): ModalData => {
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
    })

    convertedMonths = computed(() => {
        const months = this.months();
        return months?.map(m => ({
            value: m,
            label:  new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2000, m - 1))
        }))
    })

}
