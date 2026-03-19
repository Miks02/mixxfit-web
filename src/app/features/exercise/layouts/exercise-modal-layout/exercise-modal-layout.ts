import { Component, inject, output } from '@angular/core';
import { ExerciseModalLayoutService } from '../../services/exercise-modal-layout-service';
import { Router, RouterOutlet } from '@angular/router';
import { NgIcon } from "@ng-icons/core";

@Component({
  selector: 'app-exercise-modal-layout',
  imports: [NgIcon, RouterOutlet],
  templateUrl: './exercise-modal-layout.html',
  styleUrl: './exercise-modal-layout.css',
})
export class ExerciseModalLayout {
    close = output<void>();

    private modalLayout = inject(ExerciseModalLayoutService);
    private router = inject(Router);

    config = this.modalLayout.config();

    onClose = () => this.close.emit();



}
