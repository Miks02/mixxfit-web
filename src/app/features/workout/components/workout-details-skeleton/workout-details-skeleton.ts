import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
    selector: 'app-workout-details-skeleton',
    standalone: true,
    imports: [NgxSkeletonLoaderModule],
    templateUrl: './workout-details-skeleton.html',
    styleUrl: './workout-details-skeleton.css'
})
export class WorkoutDetailsSkeleton {
}
