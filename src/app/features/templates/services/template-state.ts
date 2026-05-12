import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { ExerciseService } from '../../exercise/services/exercise-service';
import { createCurrentTemplate } from '../factories/template-factories';

@Injectable({
    providedIn: 'root',
})
export class TemplateState {
    private fb = inject(NonNullableFormBuilder);
    private exerciseService = inject(ExerciseService);

    form = createCurrentTemplate(this.fb);

    templateFormValue = toSignal(this.form.valueChanges, {initialValue: this.form.value})

    templateId = computed(() => this.templateFormValue().id ?? null);
    templateName = computed(() => this.templateFormValue().name ?? "")
    templateExercises = computed(() => this.templateFormValue().exercises ?? [])
    templateNotes = computed(() => this.templateFormValue().notes)
    templateFormUrl = computed(() => {
        return this.templateId()
        ? `workout-form/templates/edit/${this.templateId()}`
        : 'workout-form/templates/create'
    })

    get templateExerciseArr() {
        return this.form.get("exercises") as FormArray;
    }

    addExerciseToTemplate(exerciseIds: number[]) {
        exerciseIds.forEach(ex => {
            let foundExercise = this.exerciseService.exercises()?.find(e => e.id == ex);
            if(!foundExercise)
                return;

            const entry = this.fb.group({
            exerciseId: [foundExercise.id],
            setCount: [1],
            exerciseName: [foundExercise.name],
            muscleGroupName: [foundExercise.muscleGroupName],
            exerciseType: [foundExercise.exerciseType]
        });

            this.templateExerciseArr.push(entry);
        })

    }

    addValuesToTemplateForm(id: number, exerciseIds: number[], name: string, notes: string) {
        this.form.get("id")?.setValue(id)
        this.form.get("name")?.setValue(name)
        this.form.get("notes")?.setValue(notes)

        this.addExerciseToTemplate(exerciseIds)

    }

    removeExerciseFromTemplate(index: number) {
        this.templateExerciseArr.removeAt(index);
    }

    isFormValid = () => this.form.valid;

    clearForm = () => {
        this.form.reset()
        this.templateExerciseArr.clear()
    }

}
