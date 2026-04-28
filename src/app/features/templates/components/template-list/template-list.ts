import { Component, computed, inject } from '@angular/core';
import { TemplateService } from '../../services/template-service';
import { Button } from "../../../../shared/button/button";
import { take, tap } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidGear, faSolidPlus } from '@ng-icons/font-awesome/solid';

@Component({
    selector: 'app-template-list',
    imports: [Button, NgIcon],
    providers: [provideIcons({faSolidGear, faSolidPlus})],
    templateUrl: './template-list.html',
    styleUrl: './template-list.css',
})
export class TemplateList {
    templateService = inject(TemplateService);

    templates = this.templateService.templates;


    userTemplates = computed(() => this.templates()?.filter(t => !t.isSystem))
    systemTemplates = computed(() => this.templates()?.filter(t => t.isSystem))

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

}
