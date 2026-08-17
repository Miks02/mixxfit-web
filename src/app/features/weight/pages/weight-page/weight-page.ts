import { DatePipe, SlicePipe } from '@angular/common';
import {
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    Signal,
    signal,
    ViewChild,
    WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuickTipsCard } from '@features/weight/components/quick-tips-card/quick-tips-card';
import { WeightPageCard } from '@features/weight/components/weight-page-card/weight-page-card';
import { WeightRecord } from '@features/weight/models/weight-record';
import { NgIcon, provideIcons } from '@ng-icons/core';
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
    faSolidWeightScale,
} from '@ng-icons/font-awesome/solid';
import { Button, Modal, ModalData, ModalType } from '@shared';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { fromEvent, map, startWith } from 'rxjs';
import { isControlValid } from '../../../../core/helpers/form-helpers';
import { formatDate } from '../../../../core/helpers/utility';
import { NotificationService } from '../../../../core/services/notification-service';
import { UserState } from '../../../../core/states/user-state';
import { LayoutState } from '../../../../layout/services/layout-state';
import { WeightChart } from '../../components/weight-chart/weight-chart';
import {
    createTargetWeightForm,
    createWeightEntryForm,
} from '../../factories/weight-form-factories';
import { WeightEntryService } from '../../services/weight-entry-service';
import { SetTargetModal } from '@features/weight/components/set-target-modal/set-target-modal';

@Component({
    selector: 'app-weight-page',
    imports: [
        WeightChart,
        NgIcon,
        ReactiveFormsModule,
        DatePipe,
        SlicePipe,
        Modal,
        FormsModule,
        NgxSkeletonLoaderComponent,
        Button,
        WeightPageCard,
        QuickTipsCard,
        SetTargetModal,
    ],
    templateUrl: './weight-page.html',
    styleUrl: './weight-page.css',
    providers: [
        provideIcons({
            faSolidScaleUnbalanced,
            faSolidBullseye,
            faSolidMagnifyingGlassChart,
            faSolidClock,
            faSolidWeightScale,
            faSolidNoteSticky,
            faSolidGhost,
            faSolidChevronLeft,
            faSolidChevronRight,
            faSolidChartLine,
        }),
    ],
})
export class WeightPage {
    isControlValid = isControlValid;
    @ViewChild('quickLog') quickLogRef!: ElementRef;

    windowWidth = toSignal(
        fromEvent(window, 'resize').pipe(
            map(() => window.innerWidth),
            startWith(window.innerWidth),
        ),
        { initialValue: window.innerWidth },
    );

    private layoutState = inject(LayoutState);
    private weightService = inject(WeightEntryService);
    private userState = inject(UserState);
    private fb = inject(FormBuilder);
    private notificationService = inject(NotificationService);

    isModalOpen = signal(false);
    selectedWeightEntry: WritableSignal<WeightRecord | null> = signal(null);
    user = this.userState.userDetails;

    form = createWeightEntryForm(this.fb);
    targetWeightForm = createTargetWeightForm(this.fb);
    isTargetFormOpen = signal(false);

    selectedYear: WritableSignal<number | null> = signal(null);
    selectedMonth: WritableSignal<number | null> = signal(null);

    months = computed(() => this.weightListDetails.data()?.months);
    years = computed(() => this.weightSummary.data()?.years);
    targetWeight = computed(() => this.user()?.targetWeight);
    targetWeightDescription = computed(() => {
        const targetWeight = this.targetWeight();

        if (!targetWeight) return 'Not set';

        return `${targetWeight} kg`;
    });

    weightSummary = this.weightService.weightSummaryQuery(
        this.selectedMonth,
        this.selectedYear,
        this.targetWeight as Signal<number | null>,
    );
    weightListDetails = this.weightService.weightListDetailsQuery(
        this.selectedMonth,
        this.selectedYear,
    );

    weightLogs = computed(() => this.weightListDetails.data()?.weightLogs);

    currentWeight = computed(() => {
        const currentWeight = this.weightSummary.data()?.currentWeight;
        if (!currentWeight) return 'Not set';

        return currentWeight?.weight.toString() + ' kg';
    });

    currentWeightCreatedAt = computed(() => {
        const currentWeight = this.weightSummary.data()?.currentWeight;
        if (!currentWeight) return 'Not available';

        return currentWeight.createdAt;
    });

    weightDelta = computed(() => {
        const weightDelta = this.weightSummary.data()?.weightDelta;

        if (!weightDelta) return '';

        if (weightDelta.delta < 0)
            return `- ${-weightDelta.delta} kg since ` + weightDelta?.createdAt;

        return `+ ${weightDelta.delta} kg since ` + weightDelta?.createdAt;
    });
    weightChart = computed(() => {
        console.log(this.weightSummary.data()?.weightChart);
        return this.weightSummary.data()?.weightChart;
    });
    progress = computed(() => {
        const targetWeight = this.targetWeight();
        const currentWeight = this.weightSummary.data()?.currentWeight;

        if (!targetWeight) return 'Set your target';

        if (!currentWeight) return '';

        return (targetWeight - currentWeight.weight).toString() + ' kg left to reach target';
    });

    constructor() {
        this.layoutState.setTitle('Weight Tracking');

        effect(() => {
            const months = this.convertedMonths();
            const selected = this.selectedMonth();
            if (selected !== null && months && !months.some((m) => m.value === selected)) {
                this.selectedMonth.set(null);
            }
        });

        effect(() => {
            const years = this.years();
            const selected = this.selectedYear();
            if (selected !== null && years && !years.includes(selected)) {
                this.selectedYear.set(null);
            }
        });
    }

    onSubmit() {
        if (this.form.invalid) return;

        this.weightService.addWeightEntryMutation.mutate(this.form.value, {
            onSuccess: () => {
                this.form.reset();
                const selMonth = this.selectedMonth();
                const selYear = this.selectedYear();

                if (selMonth === null && selYear === null) {
                    this.notificationService.showSuccess('Weight entry saved');
                    return;
                }
                this.notificationService.showSuccess('New weight entry saved. Update your filters');
            },
            onError: (err) => {
                if (err.errorCode === 'WeightEntry.LimitReached')
                    this.notificationService.showInfo('You can only log weight once per day');
            },
        });
    }

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
        let selected = this.selectedWeightEntry();
        if (!selected) return;

        this.weightService.deleteWeightEntryMutation.mutate(selected.id, {
            onSuccess: () => {
                this.isModalOpen.set(false);
                this.notificationService.showSuccess('Weight log has been deleted successfully');
            },
        });
    }

    getTargetWeightMessage = computed(() => {
        const currentWeight = this.weightSummary.data()?.currentWeight?.weight;

        if(!this.targetWeight() || !currentWeight) return ''
        
        if (this.targetWeight() === currentWeight) return 'You have reached your goal, well done!';
        return 'Keep going you can do it!';
    });

    buildModal = computed((): ModalData => {
        const entry = this.selectedWeightEntry();
        const entryDate = formatDate(entry?.createdAt!);

        return {
            title: `${entry?.weight} KG | ${entry?.timeLogged.substring(0, 5)} | ${entryDate}`,
            subtitle: `You are about to delete this weight entry. This action cannot be undone.`,
            type: ModalType.Warning,
            primaryActionLabel: 'Confirm',
            secondaryActionLabel: 'Close',
            primaryAction: () => this.deleteWeightEntry(),
            secondaryAction: () => this.isModalOpen.set(false),
        };
    });

    convertedMonths = computed(() => {
        const months = this.months();
        return months?.map((m) => ({
            value: m,
            label: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
                new Date(2000, m - 1),
            ),
        }));
    });

    showQuickLog = computed(() => this.windowWidth() < 768);

    onQuickLog() {
        this.quickLogRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    onSetTarget() {
        this.isTargetFormOpen.set(true);
    }
}
