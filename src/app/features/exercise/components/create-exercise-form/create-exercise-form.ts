import { Component, inject } from '@angular/core';
import { ExerciseModalLayoutService } from '../../services/exercise-modal-layout-service';

@Component({
  selector: 'app-create-exercise-form',
  imports: [],
  templateUrl: './create-exercise-form.html',
  styleUrl: './create-exercise-form.css',
})
export class CreateExerciseForm {
    modalLayout = inject(ExerciseModalLayoutService);

    config = this.modalLayout.config;

    constructor() {
        this.modalLayout.setConfig({title: "Create Exercise", action: [], showBackButton: true})
    }
}
