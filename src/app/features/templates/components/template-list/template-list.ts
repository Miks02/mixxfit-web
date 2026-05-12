import { Component, computed, ElementRef, inject, NgZone, OnDestroy, signal, ViewChild } from '@angular/core';
import { TemplateService } from '../../services/template-service';
import { Button } from "../../../../shared/button/button";
import { finalize, take } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidGear, faSolidPlus } from '@ng-icons/font-awesome/solid';
import { TemplateModalLayoutService } from '../../services/template-modal-layout-service';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { Router } from '@angular/router';
import { TemplateState } from '../../services/template-state';

@Component({
    selector: 'app-template-list',
    imports: [NgIcon, NgxSkeletonLoaderComponent, Button],
    providers: [provideIcons({faSolidGear, faSolidPlus})],
    templateUrl: './template-list.html',
    styleUrl: './template-list.css',
})
export class TemplateList {
    @ViewChild('rootContainer') rootContainer!: ElementRef<HTMLElement>;

    templateService = inject(TemplateService);
    templateState = inject(TemplateState);
    templateModal = inject(TemplateModalLayoutService);
    router = inject(Router);

    isLoading = signal(true);
    skeletonItems = [1, 2, 3, 4, 5];

    templates = this.templateService.templates;
    userTemplates = computed(() => this.templates()?.filter(t => !t.isSystem));
    systemTemplates = computed(() => this.templates()?.filter(t => t.isSystem));

    constructor() {
        this.templateModal.setConfig({
            title: 'Templates',
            action: [],
            showBackButton: false
        });
    }

    ngOnInit() {
        this.templateService.getTemplates()
        .pipe(
            take(1),
            finalize(() => this.isLoading.set(false))
        )
        .subscribe();
    }

    transformedName(templateName: string) {
        if (templateName.length <= 19) return templateName;
        return templateName.slice(0, 19) + '...';
    }

    getTemplateDetails(id: number) {
        this.router.navigate([`workout-form/templates/details/${id}`]);
    }

    goToTemplateCreation() {
        this.router.navigate([`workout-form/templates/exercises`])
    }

    goToCurrentTemplate() {
        this.router.navigate([this.templateState.templateFormUrl()]);
    }

    isTemplateActive = computed(() => {
        let tempExercises = this.templateState.templateExercises();

        if(!tempExercises || tempExercises.length === 0)
            return false;
        return true;
    })
}
