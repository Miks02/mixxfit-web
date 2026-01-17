import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidDumbbell, faSolidFireFlameCurved, faSolidGlassWater, faSolidMoon, faSolidScaleUnbalanced, faSolidUtensils, faSolidCalculator } from '@ng-icons/font-awesome/solid';
import {
    Chart, registerables
} from 'chart.js';
import { WorkoutsChart } from "../misc/workouts-chart/workouts-chart";
import { LayoutState } from '../../layout/services/layout-state';
import { AuthService } from '../../core/services/auth-service';
import { Subject, take, takeUntil } from 'rxjs';
import { WeightChart } from "../misc/weight-chart/weight-chart";
import { RouterLink } from "@angular/router";
import { DashboardState } from './services/dashboard-state';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../../core/services/user-service';
import { DatePipe } from '@angular/common';
Chart.register(...registerables)

@Component({
    selector: 'app-dashboard',
    imports: [NgIcon, WorkoutsChart, WeightChart, RouterLink, DatePipe],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
    providers: [provideIcons({faSolidDumbbell, faSolidFireFlameCurved, faSolidGlassWater, faSolidMoon, faSolidScaleUnbalanced, faSolidUtensils, faSolidCalculator})]
})
export class Dashboard {
    layoutState = inject(LayoutState);
    dashboardState = inject(DashboardState);
    userService = inject(UserService);

    dashboard$ = toSignal(this.dashboardState.dashboard$, {initialValue: null})
    user$ = toSignal(this.userService.userDetails$, {initialValue: null})

    ngOnInit() {
        this.layoutState.setTitle("Dashboard")
        this.loadDashboard();
    }

    loadDashboard() {
        return this.dashboardState.getDashboard()
        .pipe(take(1))
        .subscribe();
    }

}
