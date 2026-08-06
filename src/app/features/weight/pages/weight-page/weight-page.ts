import { DatePipe, DecimalPipe, SlicePipe } from "@angular/common";
import { afterNextRender, Component, computed, effect, ElementRef, inject, Signal, signal, viewChildren, WritableSignal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { WeightRecord } from "@features/weight/models/weight-record";
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
import { Button, Modal, ModalData, ModalType } from '@shared';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { take } from 'rxjs';
import { isControlValid } from '../../../../core/helpers/form-helpers';
import { formatDate } from '../../../../core/helpers/utility';
import { NotificationService } from '../../../../core/services/notification-service';
import { UserState } from '../../../../core/states/user-state';
import { LayoutState } from '../../../../layout/services/layout-state';
import { WeightChart } from "../../components/weight-chart/weight-chart";
import { createTargetWeightForm, createWeightEntryForm } from "../../factories/weight-form-factories";
import { WeightEntryService } from '../../services/weight-entry-service';

@Component({
    selector: 'app-weight-page',
    imports: [WeightChart, NgIcon, ReactiveFormsModule, DatePipe, DecimalPipe, SlicePipe, Modal, FormsModule, NgxSkeletonLoaderComponent, Button],
    templateUrl: './weight-page.html',
    styleUrl: './weight-page.css',
    providers: [provideIcons({faSolidScaleUnbalanced, faSolidBullseye, faSolidMagnifyingGlassChart, faSolidClock, faSolidWeightScale, faSolidNoteSticky, faSolidGhost, faSolidChevronLeft, faSolidChevronRight, faSolidChartLine})]
})
export class WeightPage  {
    isControlValid = isControlValid

    private layoutState = inject(LayoutState);
    private weightService = inject(WeightEntryService);
    private userState = inject(UserState);
    private fb = inject(FormBuilder);
    private notificationService = inject(NotificationService);
    private router = inject(Router);
    private activatedroute = inject(ActivatedRoute);

    isModalOpen = signal(false);
    selectedWeightEntry: WritableSignal<WeightRecord | null> = signal(null);
    user = this.userState.userDetails;

    form = createWeightEntryForm(this.fb);
    targetWeightForm = createTargetWeightForm(this.fb);
    isTargetFormOpen = signal(false);

    selectedYear: WritableSignal<number | null> = signal(null);
    selectedMonth: WritableSignal<number | null> = signal(null);

    months = computed(() => this.weightSummary.data()?.weightListDetails.months);
    years = computed(() => this.weightSummary.data()?.years);
    targetWeight = computed(() => this.user()?.targetWeight);

    weightSummary = this.weightService.weightSummaryQuery(this.selectedMonth, this.selectedYear, this.targetWeight as Signal<number | null>);
    weightListDetails = this.weightService.weightListDetailsQuery(this.selectedMonth, this.selectedYear);

    weightLogs = computed(() => this.weightListDetails.data()?.weightLogs);
    firstEntry = computed(() => this.weightSummary.data()?.firstEntry);
    currentWeight = computed(() => this.weightSummary.data()?.currentWeight);
    progress = computed(() => this.weightSummary.data()?.progress);
    weightChart = computed(() => this.weightSummary.data()?.weightChart);
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
        })
    }

    onSubmit() {
        if(this.form.invalid)
            return;

        this.weightService.addWeightEntryMutation.mutate(this.form.value, {
            onSuccess: () => {
                this.form.reset();
                const selMonth = this.selectedMonth();
                const selYear = this.selectedYear();

                if (selMonth === null && selYear === null) {
                    this.notificationService.showSuccess("Weight entry saved");
                    return;
                }
                this.notificationService.showSuccess("New weight entry saved. Update your filters");
            },
            onError: (err) => {
                if(err.errorCode === "WeightEntry.LimitReached")
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
        this.weightService.updateTargetWeightMutation.mutate(this.targetWeightForm.value, {
            onSuccess: () => {
                this.notificationService.showSuccess("Target weight updated successfully");
                this.isTargetFormOpen.set(false);
            }
        });
    }

    cancelTargetWeightEdit() {
        this.isTargetFormOpen.set(false);
        this.targetWeightForm.reset();
    }

    loadWeightEntry(id: number) {
        const logs = this.weightLogs();

        const selectedLog = logs?.find((l) => l.id == id);
        if (!selectedLog) {
            this.notificationService.showError("Requested weight log not found. Please try again");
            return;
        }
        this.selectedWeightEntry.set(selectedLog);
        this.isModalOpen.set(true);
    }

    deleteWeightEntry() {
        let selected = this.selectedWeightEntry();
        if(!selected)
            return;

        this.weightService.deleteWeightEntryMutation.mutate(selected.id, {
            onSuccess: () => {
                this.isModalOpen.set(false);
                this.notificationService.showSuccess("Weight log has been deleted successfully")
            }
        });
    }

    getTargetWeightMessage = computed(() => {
        if(this.targetWeight() === this.currentWeight()?.weight)
            return "You have reached your goal, well done!";
        return "Keep going you can do it!";
    })

    buildModal = computed((): ModalData => {
        const entry = this.selectedWeightEntry();
        const entryDate = formatDate(entry?.createdAt!)

        return {
            title: `${entry?.weight} KG | ${entry?.timeLogged.substring(0, 5)} | ${entryDate}`,
            subtitle: `You are about to delete this weight entry. This action cannot be undone.`,
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
