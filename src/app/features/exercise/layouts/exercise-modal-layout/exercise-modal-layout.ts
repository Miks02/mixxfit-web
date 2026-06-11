import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { faSolidDumbbell, faSolidFilter, faSolidLeftLong, faSolidMagnifyingGlass, faSolidPlus, faSolidXmark } from '@ng-icons/font-awesome/solid';
import { take } from 'rxjs';
import { ExerciseModalLayoutService } from '../../services/exercise-modal-layout-service';
import { ExerciseService } from '../../services/exercise-service';

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
    private exerciseSerivec = inject(ExerciseService);

    config = this.modalLayout.config;

    ngOnInit() {
        this.loadExercises();
    }

    loadExercises() {
        this.exerciseSerivec.getExercises()
        .pipe(take(1))
        .subscribe();
    }

    onClose() {
        this.router.navigate(['workout-form']);
    }

    onCreateExercise() {
        this.router.navigate(['/workout-form/exercises/create'])
    }

    onBack() {
        history.back();
    }

}
