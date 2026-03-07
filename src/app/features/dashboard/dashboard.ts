import { Component, computed, inject, effect, WritableSignal, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidDumbbell, faSolidFireFlameCurved, faSolidGlassWater, faSolidMoon, faSolidScaleUnbalanced, faSolidUtensils, faSolidCalculator, faSolidGhost,  faSolidChartLine, faSolidUser } from '@ng-icons/font-awesome/solid';
import {
    Chart, registerables
} from 'chart.js';
import { WorkoutsChart } from "../misc/workouts-chart/workouts-chart";
import { LayoutState } from '../../layout/services/layout-state';
import { take } from 'rxjs';
import { WeightChart } from '../weight/components/weight-chart/weight-chart';
import { Router, RouterLink } from "@angular/router";
import { DashboardState } from './services/dashboard-state';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { WorkoutService } from '../workout/services/workout-service';
import { FormsModule } from '@angular/forms';
import { WeightEntryService } from '../weight/services/weight-entry-service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CalorieCalculator } from '../nutrition/components/calorie-calculator/calorie-calculator';
import { UserState } from '../../core/states/user-state';
Chart.register(...registerables)

@Component({
    selector: 'app-dashboard',
    imports: [NgIcon, WorkoutsChart, WeightChart, RouterLink, DatePipe, FormsModule, NgxSkeletonLoaderModule, CalorieCalculator],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
    providers: [provideIcons({faSolidDumbbell, faSolidFireFlameCurved, faSolidGlassWater, faSolidMoon, faSolidScaleUnbalanced, faSolidUtensils, faSolidCalculator, faSolidGhost, faSolidChartLine, faSolidUser})]
})
export class Dashboard {
    private layoutState = inject(LayoutState);
    private dashboardState = inject(DashboardState);
    private userState = inject(UserState);
    private workoutService = inject(WorkoutService);
    private weightService = inject(WeightEntryService);
    private router = inject(Router)

    isLoading: boolean = false;
    isCalorieCalculatorOpen: WritableSignal<boolean> = signal(false);

    dashboardSource = toSignal(this.dashboardState.dashboard$, {initialValue: null})
    workoutsPerMonth = toSignal(this.workoutService.workoutCounts$, {initialValue: null});
    weightChart = this.weightService.weightChart;

    years = computed(() => this.workoutsPerMonth()?.years)
    recentWorkouts = computed(() => this.dashboardSource()?.recentWorkouts)

    selectedYear: number = new Date().getFullYear();
    private yearInitialized = false;

    userDetails = this.userState.userDetails;

    constructor() {
        effect(() => {
            const years = this.years();
            if (years && years.length > 0 && !this.yearInitialized) {
                this.selectedYear = years[0];
                this.yearInitialized = true;
            }
        });
    }
    ngOnInit() {
        this.layoutState.setTitle("Dashboard")
        this.loadDashboard();
        this.loadCounts();
        this.loadWeightChart();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            const elements = document.querySelectorAll('.typewriter');
            elements.forEach((el: any) => {
                el.style.setProperty('--target-width', el.scrollWidth + 'px');
            });
        }, 100);
    }

    loadDashboard() {
        return this.dashboardState.getDashboard()
        .pipe(take(1))
        .subscribe();
    }

    loadCounts(year: number | null = null) {
        return this.workoutService.getUserWorkoutCountsByMonth(year)
        .pipe(take(1))
        .subscribe();
    }

    loadWeightChart() {
        const targetWeight = this.userDetails()?.targetWeight;
        return this.weightService.getMyWeightChart(targetWeight)
        .pipe(take(1))
        .subscribe();
    }

    getToWorkout(id: number) {
        this.router.navigate(['/workouts/', id])
    }

    getUserWeight() {
        const weight = this.userDetails()?.currentWeight;
        if(weight)
            return weight + " KG"
        return "N/A"
    }

    getUserHeight() {
        const height = this.userDetails()?.height;

        if(height)
            return height + " CM"
        return "N/A"
    }

    getUserAge() {
        const age = this.userDetails()?.age;
        if(age)
            return age
        return "N/A"
    }

    getProfileImageSrc(): string {
        if (this.userDetails()?.imagePath && this.userDetails()?.imagePath !== null) return this.userDetails()!.imagePath as string;
        return this.userDetails()?.gender === 1 ? 'user_male.png' : (this.userDetails()?.gender === 2 ? 'user_female.png' : 'user_other.png');
    }

}
