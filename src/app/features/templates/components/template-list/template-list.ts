import { AfterViewInit, Component, computed, ElementRef, inject, NgZone, OnDestroy, signal, ViewChild } from '@angular/core';
import { TemplateService } from '../../services/template-service';
import { Button } from "../../../../shared/button/button";
import { finalize, take } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidGear, faSolidPlus } from '@ng-icons/font-awesome/solid';
import { TemplateModalLayoutService } from '../../services/template-modal-layout-service';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { Router } from '@angular/router';

@Component({
    selector: 'app-template-list',
    imports: [NgIcon, NgxSkeletonLoaderComponent],
    providers: [provideIcons({faSolidGear, faSolidPlus})],
    templateUrl: './template-list.html',
    styleUrl: './template-list.css',
})
export class TemplateList implements AfterViewInit, OnDestroy {
    @ViewChild('rootContainer') rootContainer!: ElementRef<HTMLElement>;

    templateService = inject(TemplateService);
    templateModal = inject(TemplateModalLayoutService);
    router = inject(Router);
    private ngZone = inject(NgZone);

    isLoading = signal(true);
    skeletonItems = [1, 2, 3, 4, 5];
    private containerWidth = signal(0);
    private resizeObserver?: ResizeObserver;

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

    ngAfterViewInit() {
        this.resizeObserver = new ResizeObserver(entries => {
            const width = entries[0]?.contentRect.width ?? 0;
            this.ngZone.run(() => this.containerWidth.set(width));
        });
        this.resizeObserver.observe(this.rootContainer.nativeElement);
    }

    ngOnDestroy() {
        this.resizeObserver?.disconnect();
    }

    transformedName(templateName: string) {
        if (this.containerWidth() > 400) return templateName;
        if (templateName.length <= 19) return templateName;
        return templateName.slice(0, 19) + '...';
    }

    getTemplateDetails(id: number) {
        this.router.navigate([`workout-form/templates/details/${id}`]);
    }
}
