import { DatePipe, SlicePipe } from '@angular/common';
import {
    Component,
    computed,
    ElementRef,
    inject,
    signal,
    ViewChild,
    WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuickLog } from '@features/weight/components/quick-log/quick-log';
import { QuickTipsCard } from '@features/weight/components/quick-tips-card/quick-tips-card';
import { SetTargetModal } from '@features/weight/components/set-target-modal/set-target-modal';
import { WeightChart } from '@features/weight/components/weight-chart/weight-chart';
import { WeightEntries } from '@features/weight/components/weight-entries/weight-entries';
import { WeightPageCard } from '@features/weight/components/weight-page-card/weight-page-card';
import { WeightRecord } from '@features/weight/models/weight-record';
import { WeightState } from '@features/weight/services/weight-state';
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
import { Button, Modal } from '@shared';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { fromEvent, map, startWith } from 'rxjs';
import { isControlValid } from '../../../../core/helpers/form-helpers';
import { LayoutState } from '../../../../layout/services/layout-state';

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
        QuickLog,
        WeightEntries,
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
        }), WeightState
    ],
})
export class WeightPage {
    isControlValid = isControlValid;
    @ViewChild('quickLog', { read: ElementRef }) quickLogRef!: ElementRef;

    windowWidth = toSignal(
        fromEvent(window, 'resize').pipe(
            map(() => window.innerWidth),
            startWith(window.innerWidth),
        ),
        { initialValue: window.innerWidth },
    );

    private layoutState = inject(LayoutState);
    private weightState = inject(WeightState);

    isModalOpen = signal(false);
    selectedWeightEntry: WritableSignal<WeightRecord | null> = signal(null);
    user = this.weightState.user;

    isTargetFormOpen = signal(false);

    months = this.weightState.months;
    years = this.weightState.years;
    targetWeight = this.weightState.targetWeight;
    targetWeightDescription = this.weightState.targetWeightDescription;

    weightSummary = this.weightState.weightSummaryQuery;

    currentWeight = this.weightState.currentWeight;
    currentWeightCreatedAt = this.weightState.currentWeightCreatedAt;
    weightDelta = this.weightState.weightDelta;
    weightChart = this.weightState.weightChart;
    progress = this.weightState.progress;
    getTargetWeightMessage = this.weightState.targetWeightMessage;

    constructor() {
        this.layoutState.setTitle('Weight Tracking');
    }

    showQuickLog = computed(() => this.windowWidth() < 768);

    onQuickLog() {
        this.quickLogRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    onSetTarget() {
        this.isTargetFormOpen.set(true);
    }

    onAppliedFilters(filters: { year: number | null; month: number | null }) {
        this.weightState.setFilters(filters);
    }
}
