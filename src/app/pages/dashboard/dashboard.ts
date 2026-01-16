import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidDumbbell, faSolidFireFlameCurved, faSolidGlassWater, faSolidMoon, faSolidScaleUnbalanced, faSolidUtensils, faSolidCalculator } from '@ng-icons/font-awesome/solid';
import {
    Chart, registerables
} from 'chart.js';
import { WorkoutsChart } from "../misc/workouts-chart/workouts-chart";
import { LayoutState } from '../../layout/services/layout-state';
import { AuthService } from '../../core/services/auth-service';
import { Subject, takeUntil } from 'rxjs';
import { WeightChart } from "../misc/weight-chart/weight-chart";
import { RouterLink } from "@angular/router";

Chart.register(...registerables)

@Component({
    selector: 'app-dashboard',
    imports: [NgIcon, WorkoutsChart, WeightChart, RouterLink],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
    providers: [provideIcons({faSolidDumbbell, faSolidFireFlameCurved, faSolidGlassWater, faSolidMoon, faSolidScaleUnbalanced, faSolidUtensils, faSolidCalculator})]
})
export class Dashboard {
    layoutState = inject(LayoutState)

    private destroy$ = new Subject<void>();


    ngOnInit() {
        this.layoutState.setTitle("Dashboard")
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
