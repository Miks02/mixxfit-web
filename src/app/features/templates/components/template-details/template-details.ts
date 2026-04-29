import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidChildReaching, faSolidDumbbell, faSolidGear, faSolidPersonRunning, faSolidPersonWalkingArrowLoopLeft } from '@ng-icons/font-awesome/solid';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { finalize, take, tap } from 'rxjs';
import { Button } from '../../../../shared/button/button';
import { ExerciseService } from '../../../exercise/services/exercise-service';
import { ExerciseSessionService } from '../../../exercise/services/exercise-session-service';
import { TemplateDto } from '../../models/template-dto';
import { TemplateModalLayoutService } from '../../services/template-modal-layout-service';
import { TemplateService } from '../../services/template-service';

type TemplateExerciseView = {
    exerciseId: number;
    setCount: number;
    order: number;
    exerciseName: string;
    muscleGroupName: string;
    exerciseType: number;
    isUserDefined: boolean;
};

@Component({
    selector: 'app-template-details',
    imports: [NgIcon, NgxSkeletonLoaderComponent, Button],
    providers: [provideIcons({ faSolidDumbbell, faSolidPersonRunning, faSolidChildReaching, faSolidGear, faSolidPersonWalkingArrowLoopLeft })],
    templateUrl: './template-details.html',
    styleUrl: './template-details.css',
})
export class TemplateDetails {
    private templateService = inject(TemplateService);
    private templateLayout = inject(TemplateModalLayoutService);
    private exerciseService = inject(ExerciseService);
    private exerciseSession = inject(ExerciseSessionService);
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);

    isLoading: WritableSignal<boolean> = signal(true);
    selectedTemplate: WritableSignal<TemplateDto | undefined> = signal(undefined);

    templateId!: number;

    exerciseViews = computed<TemplateExerciseView[]>(() => {
        const template = this.selectedTemplate();
        const exercises = this.exerciseService.exercises();
        if (!template || !exercises) return [];

        return template.exercises
            .map(te => {
                const exercise = exercises.find(e => e.id === te.exerciseId);
                if (!exercise) return null;
                return {
                    exerciseId: te.exerciseId,
                    setCount: te.setCount,
                    order: te.order,
                    exerciseName: exercise.name,
                    muscleGroupName: exercise.muscleGroupName,
                    exerciseType: exercise.exerciseType,
                    isUserDefined: exercise.isUserDefined,
                };
            })
            .filter((e): e is TemplateExerciseView => e !== null);
    });

    constructor() {
        this.templateId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        this.templateLayout.setConfig({ title: 'Template Details', showBackButton: true, action: [] });
    }

    ngOnInit() {
        this.loadTemplate(this.templateId);
    }

    loadTemplate(id: number) {
        this.templateService.getTemplateById(id).pipe(
            take(1),
            tap(res => this.selectedTemplate.set(res)),
            finalize(() => this.isLoading.set(false))
        ).subscribe();
    }

    addToSession() {
        this.exerciseSession.addMultipleExercises(this.exerciseViews())
        this.router.navigate(['workout-form/exercises/session'])
    }
}
