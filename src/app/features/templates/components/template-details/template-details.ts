import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidChildReaching, faSolidDumbbell, faSolidGear, faSolidPersonRunning, faSolidPersonWalkingArrowLoopLeft } from '@ng-icons/font-awesome/solid';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { finalize, take, tap } from 'rxjs';
import { Button } from '@shared';
import { ExerciseService, ExerciseSessionService } from '@features/exercise'
import { NotificationService } from '../../../../core/services/notification-service';
import { TemplateDto } from '../../models/template-dto';
import { TemplateModalLayoutService } from '../../services/template-modal-layout-service';
import { TemplateService } from '../../services/template-service';
import { TemplateState } from '../../services/template-state';
import { TemplateExerciseView } from '../../models/template-exercise-view';

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
    private templateState = inject(TemplateState);
    private exerciseService = inject(ExerciseService);
    private exerciseSession = inject(ExerciseSessionService);
    private notificationService = inject(NotificationService);
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);

    templateId: number = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    templateSource = this.templateService.getTemplateByIdQuery(this.templateId);
    selectedTemplate = this.templateSource.data;

    isLoading = this.templateSource.isLoading;

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
                    exerciseName: exercise.name,
                    muscleGroupName: exercise.muscleGroupName,
                    exerciseType: exercise.exerciseType,
                    isUserDefined: exercise.isUserDefined,
                };
            })
            .filter((e): e is TemplateExerciseView => e !== null);
    });

    constructor() {
        this.templateLayout.setConfig({ title: 'Template Details', showBackButton: true, action: [] });

        effect(() => {
            const error = this.templateSource.error();
            if (error) {
                if (error.errorCode === "WorkoutTemplate.NotFound")
                    this.notificationService.showError("Requested template has not been found");
                else
                    this.notificationService.showError("An error occurred while loading the template. Please try again.");
                this.router.navigate(['workouts/create/templates']);
            }
        });
    }

    addToSession() {
        this.exerciseSession.addMultipleExercises(this.exerciseViews())
        this.router.navigate(['workouts/create/exercises/session'])
    }

    editTemplate() {
        const exerciseIds = this.exerciseViews().map(e => e.exerciseId);

        this.templateState.addValuesToTemplateForm(this.templateId, exerciseIds, this.selectedTemplate()?.name!, this.selectedTemplate()?.notes!)
        this.router.navigate([`workouts/create/templates/edit/${this.templateId}`])
    }
}
