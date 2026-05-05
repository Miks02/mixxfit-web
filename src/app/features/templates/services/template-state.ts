import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, NonNullableFormBuilder } from '@angular/forms';
import { ExerciseService } from '../../exercise/services/exercise-service';
import { createCurrentTemplate } from '../factories/template-factories';

@Injectable({
    providedIn: 'root',
})
export class TemplateState {
    fb = inject(NonNullableFormBuilder);
    exerciseService = inject(ExerciseService);

    form = createCurrentTemplate(this.fb);

    private templateFormValue = toSignal(this.form.valueChanges, {initialValue: this.form.value})

    templateName = computed(() => this.templateFormValue().name)
    templateExercises = computed(() => this.templateFormValue().exercises)

    getTemplateExercises() {
        return this.form.get("exercises") as FormArray;
    }

    addExerciseToTemplate(exerciseIds: number[]) {
        exerciseIds.forEach(ex => {
            let foundExercise = this.exerciseService.exercises()?.find(e => e.id == ex);
            if(!foundExercise)
                return;

            const entry: Omit<TemplateExerciseView, 'isUserDefined' | 'order'> = {
                exerciseId: foundExercise.id,
                setCount: 1,
                exerciseName: foundExercise.name,
                muscleGroupName: foundExercise.muscleGroupName,
                exerciseType: foundExercise.exerciseType
            }

            this.getTemplateExercises()?.value.push(entry);
        })

    }

    removeExerciseFromTemplate(exerciseId: number) {
        this.getTemplateExercises()?.value.filter((ex: any) => ex.exerciseId === exerciseId);
    }


}
