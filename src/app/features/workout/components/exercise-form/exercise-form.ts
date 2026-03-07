import { Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
    faSolidBars,
    faSolidBookOpen,
    faSolidCalendarDay,
    faSolidCheck,
    faSolidCircle,
    faSolidClock,
    faSolidFilter,
    faSolidFireFlameCurved,
    faSolidForwardStep,
    faSolidHeartCircleBolt,
    faSolidHeartPulse,
    faSolidNoteSticky,
    faSolidPencil,
    faSolidPersonRunning,
    faSolidRotate,
    faSolidRoute,
    faSolidScaleUnbalanced,
    faSolidStopwatch,
    faSolidTag,
    faSolidXmark
} from "@ng-icons/font-awesome/solid";
import { Subject, takeUntil } from 'rxjs';
import { addValidators, clearFormInputs, clearValidators, isControlValid, minArrayLength, onlyNumbersCheck } from '../../../../core/helpers/FormHelpers';
import { NotificationService } from '../../../../core/services/notification-service';
import { UserState } from '../../../../core/states/user-state';
import { createExerciseForm } from '../../factories/workout-factories';
import { CardioType } from '../../models/cardio-type';
import { ExerciseType } from '../../models/exercise-type';


@Component({
    selector: 'app-exercise-form',
    imports: [NgIcon, FormsModule, ReactiveFormsModule],
    templateUrl: './exercise-form.html',
    styleUrl: './exercise-form.css',
    providers: [provideIcons({faSolidTag, faSolidCalendarDay, faSolidCheck, faSolidFireFlameCurved, faSolidBookOpen, faSolidBars, faSolidPencil, faSolidNoteSticky, faSolidXmark, faSolidCircle, faSolidScaleUnbalanced, faSolidRotate, faSolidFilter, faSolidPersonRunning, faSolidClock, faSolidHeartCircleBolt, faSolidHeartPulse, faSolidRoute, faSolidStopwatch, faSolidForwardStep})]
})
export class ExerciseForm {
    @Output()
    close = new EventEmitter<void>();
    @Input()
    exercises!: FormArray;

    private userState = inject(UserState);
    private fb = inject(FormBuilder);
    private notificationService = inject(NotificationService);

    private destroy$ = new Subject<void>();

    form = createExerciseForm(this.fb)
    isControlValid = isControlValid

    userSource = this.userState.userDetails;

    currentWeight = computed(() => this.userSource()?.currentWeight)

    get sets() { return this.form.get('sets') as FormArray }
    get tempReps() { return this.form.get('tempReps') }
    get tempWeight() { return this.form.get('tempWeight') }

    ngOnInit() {
        this.initializeForm();
        this.handleExerciseTypeChange();
        this.handleCardioTypeChange();
        this.handleSetsChange();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onClose() {
        this.close.emit();
    }

    createSetGroup(reps: number, weight: number): FormGroup {
        return this.fb.group({
            reps: [reps, [Validators.required, Validators.min(1)]],
            weightKg: [weight, [Validators.min(1), Validators.max(1000)]]
        })
    }

    addBodyweightSet() {
        const reps = this.tempReps?.value;
        const addedWeight = Number(this.tempWeight?.value || 0);
        const weight = addedWeight + (this.currentWeight() || 0);

        if(reps === null) {
            this.notificationService.showWarning("Enter reps before adding a set");
            return;
        }

        if(!isControlValid('tempWeight', this.form) || !isControlValid('tempReps', this.form)) {
            this.notificationService.showWarning("Check your inputs and try again. Watch out for red indicators that indicate invalidity")
            return;
        }

        this.form.updateValueAndValidity();
        this.sets.push(this.createSetGroup(reps, weight))
    }

    addSet() {
        const reps = this.form.get('tempReps')?.value;
        const weight = this.form.get('tempWeight')?.value

        if(weight === null || reps === null) {
            this.notificationService.showWarning("Enter weight and reps before adding a set");
            return;
        }

        if(!isControlValid('tempWeight', this.form) || !isControlValid('tempReps', this.form)) {
            this.notificationService.showWarning("Check your inputs and try again. Watch out for red indicators that indicate invalidity")
            return;
        }

        this.form.updateValueAndValidity();
        this.sets.push(this.createSetGroup(reps, weight))
    }


    removeSet(index: number) {
        return this.sets.removeAt(index);
    }

    onSubmit() {
        console.log(this.form.value)
        if(this.form.invalid) {
            console.log("Exercise form is not valid")
            return;
        }
        const exerciseGroup = this.createExerciseGroup();
        this.exercises.push(exerciseGroup)
        this.close.emit();
    }


    private initializeForm() {
        if(this.form.get('exerciseType')?.value === ExerciseType.Weights || this.form.get('exerciseType')?.value === ExerciseType.Bodyweight) {
            this.tempWeight?.addValidators([Validators.required, Validators.min(1), onlyNumbersCheck()])
            this.tempReps?.addValidators([Validators.required, Validators.min(1), onlyNumbersCheck()])
        }
    }

    private handleExerciseTypeChange() {
        this.form.get('exerciseType')!.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(type => {
            this.resetFormInputs();
            if(type === ExerciseType.Cardio) {
                this.form.get('cardioType')?.patchValue(CardioType.SteadyState)
                return;
            }
            if(type === ExerciseType.Weights) {
                addValidators(['tempWeight', 'tempReps'], this.form, [Validators.required, Validators.min(1),
                Validators.max(1000), onlyNumbersCheck()])
                this.addSetValidators();
                return;
            }
            if(type === ExerciseType.Bodyweight) {
                addValidators(['tempWeight'], this.form, [Validators.min(1), Validators.max(1000), onlyNumbersCheck()])
                addValidators(['tempReps'], this.form, [Validators.required, Validators.min(1),
                Validators.max(1000),onlyNumbersCheck()])
                this.addSetValidators();
                return;
                 }
            })
        }

    private resetFormInputs() {
        this.sets.clear();
        clearFormInputs(['tempWeight', 'tempReps'], this.form)
        clearValidators(['tempWeight', 'tempReps', 'sets'], this.form)
        this.clearCardioInputs();
        this.clearCardioValidators();
        this.form.updateValueAndValidity();
    }

    private addSetValidators() {
        this.sets.addValidators(minArrayLength(1))
        this.sets.updateValueAndValidity();
    }

    private handleCardioTypeChange() {
        this.form.get('cardioType')!.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(type => {
            this.clearCardioInputs();
            this.clearCardioValidators();
            if(type === CardioType.SteadyState) {
                this.addSteadyStateCardioValidators();
                return;
            }
            if(type === CardioType.Hiit) {
                this.addHiitCardioValidators();
                return;
            }

        })
    }

    private handleSetsChange() {
        this.sets.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
            if(value.length > 0) {
                this.clearWeightAndRepsRequiredValidators();
            }
            else {
                this.tempReps?.addValidators([Validators.required, Validators.min(1), onlyNumbersCheck()]);
                this.tempWeight?.addValidators([Validators.required, Validators.min(1), onlyNumbersCheck()]);
                this.tempWeight?.updateValueAndValidity();
                this.tempReps?.updateValueAndValidity();
            }
        })
    }

    private clearWeightAndRepsRequiredValidators() {
        this.tempReps?.reset();
        this.tempWeight?.reset();
        clearValidators(['tempWeight', 'tempReps'], this.form);
        this.initializeForm();
    }

    private createExerciseGroup(): FormGroup {

        const formValue = {...this.form.value}
        delete formValue.tempWeight
        delete formValue.tempReps

        return this.fb.group({
            ...formValue,
            sets: this.fb.array(
                this.sets.controls.map(set =>
                    this.fb.group({
                        reps: set.get('reps')?.value,
                        weightKg: set.get('weightKg')?.value
                    })
                )
            )
        })
    }

    private clearCardioValidators() {
        const cardioFields: string[] =
        ['cardioType', 'durationMinutes', 'durationSeconds', 'pace', 'distance', 'avgHeartRate', 'caloriesBurned', 'workInterval', 'restInterval', 'maxHeartRate', 'intervalsCount']

        clearValidators(cardioFields, this.form);
    }

    private clearCardioInputs() {
        const cardioFields: string[] =
        ['durationMinutes', 'durationSeconds', 'pace', 'distance', 'avgHeartRate', 'caloriesBurned', 'workInterval', 'restInterval', 'maxHeartRate', 'intervalsCount']

        clearFormInputs(cardioFields, this.form);
    }

    private addSteadyStateCardioValidators() {
        addValidators(
            ['cardioType', 'durationMinutes', 'durationSeconds'],
            this.form,
            [Validators.required, Validators.min(0)]
        )

        addValidators(['pace', 'distance', 'avgHeartRate', 'caloriesBurned'], this.form, [Validators.min(0)])
    }

    private addHiitCardioValidators() {
        addValidators(
            ['cardioType', 'workInterval', 'restInterval', 'intervalsCount'],
            this.form,
            [Validators.required, Validators.min(0)]
        )

        addValidators(['maxHeartRate', 'avgHeartRate', 'caloriesBurned'], this.form, [Validators.min(0)])
    }
}
