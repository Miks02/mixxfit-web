import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { faSolidDumbbell, faSolidFilter, faSolidLeftLong, faSolidMagnifyingGlass, faSolidPlus, faSolidXmark } from '@ng-icons/font-awesome/solid';
import { ExerciseModalLayoutService } from '../../services/exercise-modal-layout-service';

@Component({
    selector: 'app-exercise-modal-layout',
    imports: [NgIcon, RouterOutlet],
    templateUrl: './exercise-modal-layout.html',
    styleUrl: './exercise-modal-layout.css',
    providers: [provideIcons({ faSolidDumbbell, faSolidMagnifyingGlass, faSolidFilter, faSolidPlus, faSolidXmark, faSolidLeftLong })]
})
export class ExerciseModalLayout {
    private modalLayout = inject(ExerciseModalLayoutService);
    private router = inject(Router);

    config = this.modalLayout.config;

    onClose() {
        this.router.navigate(['workouts/create']);
    }

    onCreateExercise() {
        this.router.navigate(['workouts/create/exercises/create'])
    }

    onBack() {
        history.back();
    }

}
