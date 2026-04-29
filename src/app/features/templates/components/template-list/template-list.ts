import { Component, computed, inject } from '@angular/core';
import { TemplateService } from '../../services/template-service';
import { Button } from "../../../../shared/button/button";
import { take, tap } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidGear, faSolidPlus } from '@ng-icons/font-awesome/solid';
import { TemplateModalLayoutService } from '../../services/template-modal-layout-service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-template-list',
    imports: [NgIcon],
    providers: [provideIcons({faSolidGear, faSolidPlus})],
    templateUrl: './template-list.html',
    styleUrl: './template-list.css',
})
export class TemplateList {
    templateService = inject(TemplateService);
    templateModal = inject(TemplateModalLayoutService);
    router = inject(Router);

    templates = this.templateService.templates

    userTemplates = computed(() => this.templates()?.filter(t => !t.isSystem))
    systemTemplates = computed(() => this.templates()?.filter(t => t.isSystem))

     constructor() {
        this.templateModal.setConfig({
            title: 'Templates',
            action: [

            ],
            showBackButton: false
        });
    }

    ngOnInit() {
        this.templateService.getTemplates()
        .pipe(take(1))
        .subscribe();
    }

    transformedName(templateName: string) {
        if(templateName.length < 12)
            return templateName;

        const slicedName = templateName.slice(0, 10);

        return slicedName + "...";
    }

    getTemplateDetails(id: number) {
        this.router.navigate([`workout-form/templates/details/${id}`])
    }

}
