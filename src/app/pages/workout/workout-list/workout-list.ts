import { Component, inject } from '@angular/core';
import { LayoutState } from '../../../layout/services/layout-state';

@Component({
  selector: 'app-workout-list',
  imports: [],
  templateUrl: './workout-list.html',
  styleUrl: './workout-list.css',
})
export class WorkoutList {
    layoutState = inject(LayoutState)

    ngOnInit() {
        this.layoutState.setTitle("Workouts")
    }
}
