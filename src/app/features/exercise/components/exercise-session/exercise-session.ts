import { Component, effect, ElementRef, inject, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidBackwardStep, faSolidTrash } from '@ng-icons/font-awesome/solid';
import { ModalData } from '../../../../core/models/ModalData';
import { ModalType } from '../../../../core/models/ModalType';
import { Modal } from '../../../../layout/utilities/modal/modal';
import { Button } from '../../../../shared/button/button';
import { ExerciseType } from '../../../workout/models/exercise-type';
import { ExerciseModalLayoutService } from '../../services/exercise-modal-layout-service';
import { ExerciseSessionService } from '../../services/exercise-session-service';

@Component({
    selector: 'app-exercise-session',
    imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, NgIcon, Button, Modal],
    templateUrl: './exercise-session.html',
    styleUrl: './exercise-session.css',
    providers: [provideIcons({ faSolidTrash, faSolidBackwardStep })]
})
export class ExerciseSession {
    @ViewChild('exercisesContainer') container!: ElementRef<HTMLDivElement>
    @ViewChildren('addSetButton', { read: ElementRef }) addSetButtons!: QueryList<ElementRef<HTMLElement>>;

    modalConfig = inject(ExerciseModalLayoutService);
    exerciseSession = inject(ExerciseSessionService);
    router = inject(Router);

    form = this.exerciseSession.form;

    ExerciseType = ExerciseType;

    isModalOpen = signal(false);
    exerciseToRemoveIndex = signal<number | null>(null);

    exercises = toSignal(this.exerciseSession.getExercises().valueChanges,
    {initialValue: this.exerciseSession.getExercises().value});

    constructor() {
        this.modalConfig.setConfig({title: "Current Session", action: [], showBackButton: true})

        effect(() => {
            const exercises = this.exercises() as [];

            if(exercises?.length === 0)
                this.backToExerciseList();

        })

    }

    ngAfterViewInit() {
        const containerHeight = this.container.nativeElement.scrollHeight;
        this.container.nativeElement.scrollTo({top: containerHeight, behavior: 'smooth'})
    }

    getExerciseType(index: number): ExerciseType {
        return this.exerciseSession.getExerciseType(index);
    }

    getExerciseTypeLabel(index: number): string {
        return ExerciseType[this.getExerciseType(index)];
    }

    addSet(exerciseIndex: number) {
        const type = this.getExerciseType(exerciseIndex);
        this.exerciseSession.addDetails(type, exerciseIndex);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => this.scrollAddSetButtonIntoView(exerciseIndex));
        });
    }

    private scrollAddSetButtonIntoView(exerciseIndex: number) {
        const containerEl = this.container?.nativeElement;
        const buttonEl = this.addSetButtons?.get(exerciseIndex)?.nativeElement;

        if (!containerEl || !buttonEl) return;

        const containerRect = containerEl.getBoundingClientRect();
        const buttonRect = buttonEl.getBoundingClientRect();
        const offset = 40;

        const isBelowViewport = buttonRect.bottom > containerRect.bottom - offset;
        const isAboveViewport = buttonRect.top < containerRect.top + offset;

        if (!isBelowViewport && !isAboveViewport) return;

        const scrollDelta = isBelowViewport
            ? buttonRect.bottom - containerRect.bottom + offset
            : buttonRect.top - containerRect.top - offset;

        containerEl.scrollBy({ top: scrollDelta, behavior: 'smooth' });
    }

    removeSet(exerciseIndex: number, setIndex: number) {
        if(this.exerciseSession.getExerciseDetails(exerciseIndex).length <= 1) return;

        this.exerciseSession.removeDetails(exerciseIndex, setIndex);
    }

    removeExercise(exerciseIndex: number) {
        this.exerciseSession.removeExercise(exerciseIndex);
    }

    openRemoveModal(exerciseIndex: number) {
        this.exerciseToRemoveIndex.set(exerciseIndex);
        this.isModalOpen.set(true);
    }

    confirmRemoveExercise() {
        const index = this.exerciseToRemoveIndex();
        if (index !== null) {
            this.removeExercise(index);
        }
        this.closeModal();
    }

    closeModal() {
        this.isModalOpen.set(false);
        this.exerciseToRemoveIndex.set(null);
    }

    buildModal(): ModalData | null {
        const index = this.exerciseToRemoveIndex();
        if (index === null) return null;

        const exerciseName = this.exerciseSession.getExercises().at(index)?.get('exerciseName')?.value;

        return {
            title: `Remove ${exerciseName}`,
            subtitle: 'You are about to remove this exercise from the current session. All sets and data for this exercise will be lost.',
            type: ModalType.Warning,
            primaryActionLabel: 'Confirm',
            secondaryActionLabel: 'Cancel',
            primaryAction: () => this.confirmRemoveExercise(),
            secondaryAction: () => this.closeModal()
        };
    }

    backToExerciseList() {
        this.router.navigate(['workout-form/exercises']);
    }
}
