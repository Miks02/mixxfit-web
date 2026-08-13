import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TemplateService } from '../../services/template-service';
import { TemplateModalLayoutService } from '../../services/template-modal-layout-service';
import { take } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidDumbbell, faSolidFilter, faSolidLeftLong, faSolidMagnifyingGlass, faSolidPlus, faSolidXmark } from '@ng-icons/font-awesome/solid';

@Component({
    selector: 'app-template-modal-layout',
    imports: [NgIcon, RouterOutlet],
    providers: [provideIcons({ faSolidDumbbell, faSolidMagnifyingGlass, faSolidFilter, faSolidPlus, faSolidXmark, faSolidLeftLong })],
    templateUrl: './template-modal-layout.html',
    styleUrl: './template-modal-layout.css',
})
export class TemplateModalLayout {
    private modalLayout = inject(TemplateModalLayoutService);
    private router = inject(Router);

    config = this.modalLayout.config;

    onClose() {
        this.router.navigate(['workouts/create']);
    }

    onBack() {
        history.back();
    }

}
