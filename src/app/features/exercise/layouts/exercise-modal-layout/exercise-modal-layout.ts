import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ExerciseModalLayoutService } from '../../services/exercise-modal-layout-service';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { faSolidDumbbell, faSolidFilter, faSolidMagnifyingGlass, faSolidPlus, faSolidXmark } from '@ng-icons/font-awesome/solid';

@Component({
  selector: 'app-exercise-modal-layout',
  imports: [NgIcon, RouterOutlet],
  templateUrl: './exercise-modal-layout.html',
  styleUrl: './exercise-modal-layout.css',
  providers: [provideIcons({ faSolidDumbbell, faSolidMagnifyingGlass, faSolidFilter, faSolidPlus, faSolidXmark })]
})
export class ExerciseModalLayout {
    private modalLayout = inject(ExerciseModalLayoutService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    config = this.modalLayout.config;

    onClose() {
        this.router.navigate(['/workout-form']);
    }

    onCreateExercise() {
        this.router.navigate(['/workout-form/exercises/create'])
    }

}
