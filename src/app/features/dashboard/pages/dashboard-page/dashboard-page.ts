import { Component, computed, inject, effect, WritableSignal, signal, viewChildren, ElementRef, afterNextRender } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidDumbbell, faSolidFireFlameCurved, faSolidGlassWater, faSolidMoon, faSolidScaleUnbalanced, faSolidUtensils, faSolidCalculator, faSolidGhost,  faSolidChartLine, faSolidUser, faSolidBolt } from '@ng-icons/font-awesome/solid';
import {
    Chart, registerables
} from 'chart.js';
import { WorkoutsChart, WorkoutService } from '@features/workout';
import { LayoutState } from '../../../../layout/services/layout-state';
import { take } from 'rxjs';
import { WeightChart, WeightEntryService } from '@features/weight';
import { Router, RouterLink } from "@angular/router";
import { DashboardService } from '../../services/dashboard-service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CalorieCalculator } from '../../../nutrition/components/calorie-calculator/calorie-calculator';
import { UserState } from '../../../../core/states/user-state';
import { Button } from '@shared';
import { DashboardCard } from '../../components/dashboard-card/dashboard-card';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
Chart.register(...registerables)

@Component({
    selector: 'app-dashboard',
    imports: [NgIcon, WorkoutsChart, WeightChart, RouterLink, DatePipe, FormsModule, NgxSkeletonLoaderModule, CalorieCalculator, Button, DashboardCard],
    templateUrl: './dashboard-page.html',
    styleUrl: './dashboard-page.css',
    providers: [provideIcons({faSolidDumbbell, faSolidFireFlameCurved, faSolidGlassWater, faSolidBolt, faSolidScaleUnbalanced, faSolidUtensils, faSolidCalculator, faSolidGhost, faSolidChartLine, faSolidUser})]
})
export class Dashboard {
    private layoutState = inject(LayoutState);
    private dashboardState = inject(DashboardService);
    private userState = inject(UserState);
    private workoutService = inject(WorkoutService);
    private weightService = inject(WeightEntryService);
    private router = inject(Router)
    selectedYear: WritableSignal<number> = signal(new Date().getFullYear());

    dashboardResource = rxResource({
        stream: () => this.dashboardState.getDashboard()
    })
    workoutChartResource = rxResource({
        params: () => ({year: this.selectedYear()}),
        stream: ({params}) => this.workoutService.getUserWorkoutCountsByMonth(params.year)
    })

    weightChartResource = rxResource({
        stream: () => this.weightService.getMyWeightChart()
    })

    dashboard = this.dashboardResource.value;
    workoutChart = this.workoutChartResource.value;
    weightChart = this.weightChartResource.value;

    isCalorieCalculatorOpen: WritableSignal<boolean> = signal(false);

    years = computed(() => this.workoutChart()?.years)

    private yearInitialized = false;

    userDetails = this.userState.userDetails;

    typewriterElements = viewChildren<ElementRef>('typewriter');

    constructor() {
        this.layoutState.setTitle("Dashboard")

        effect(() => {
            const years = this.years();
            if (years && years.length > 0 && !this.yearInitialized) {
                this.selectedYear.set(years[0]);
                this.yearInitialized = true;
            }
        });

        afterNextRender(() => {
            this.typewriterElements().forEach((el: ElementRef) => {
                el.nativeElement.style.setProperty('--target-width', el.nativeElement.scrollWidth + 'px');
            });
        });
    }

    getToWorkout(id: number) {
        this.router.navigate(['/workouts/details', id])
    }

    getUserWeight = computed(() => {
        const weight = this.userDetails()?.currentWeight;
        if(weight)
            return weight + " KG"
        return "N/A"
    })

    getUserHeight = computed(() => {
        const height = this.userDetails()?.height;

        if(height)
            return height + " CM"
        return "N/A"
    })

    getUserAge = computed(() => {
        const age = this.userDetails()?.age;
        if(age)
            return age
        return "N/A"
    })

    getProfileImageSrc = computed(() => {
        if (this.userDetails()?.imagePath && this.userDetails()?.imagePath !== null) return this.userDetails()!.imagePath as string;
        return this.userDetails()?.gender === 1 ? 'user_male.png' : (this.userDetails()?.gender === 2 ? 'user_female.png' : 'user_other.png');
    })

    getWorkoutStreakMessage = computed(() => {
        const streak = this.dashboard()?.workoutStreak;

        if(!streak || streak === 0)
            return `Not on a streak`;
        if(streak === 1)
            return `${streak} Day - Keep it going!`;
        if(streak >= 2 && streak < 5)
            return `${streak} Days - Well done!`;
        if(streak >= 5)
            return `${streak} Days - Outstanding!`;

        return "N/A"
    })

}
