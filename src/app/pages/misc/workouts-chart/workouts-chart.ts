import { Component, computed, Input, signal, Signal, WritableSignal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
    ChartConfiguration,
    ChartOptions,
    Chart, registerables
} from 'chart.js';
import { WorkoutsPerMonthDto } from '../../workout/models/WorkoutsPerMonthDto';
Chart.register(...registerables)

@Component({
    selector: 'app-workouts-chart',
    imports: [BaseChartDirective],
    templateUrl: './workouts-chart.html',
    styleUrl: './workouts-chart.css',
})
export class WorkoutsChart {
    public barChartType: 'bar' = "bar";

    @Input()
    workoutCountsSource: Signal<WorkoutsPerMonthDto | null> = signal(null)

    public barChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
        const data = this.workoutCountsSource();

        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Workouts',
                    data: [
                        data?.januaryWorkouts ?? 0,
                        data?.februaryWorkouts ?? 0,
                        data?.marchWorkouts ?? 0,
                        data?.aprilWorkouts ?? 0,
                        data?.mayWorkouts ?? 0,
                        data?.juneWorkouts ?? 0,
                        data?.julyWorkouts ?? 0,
                        data?.augustWorkouts ?? 0,
                        data?.septemberWorkouts ?? 0,
                        data?.octoberWorkouts ?? 0,
                        data?.novemberWorkouts ?? 0,
                        data?.decemberWorkouts ?? 0
                    ],
                    borderRadius: 6,
                    barPercentage: 1,
                    categoryPercentage: 0.8,
                    backgroundColor: 'rgba(235, 170, 11, 1)'
                }
            ]
        };
    });

    public barChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom'
            },
            tooltip: {
                enabled: true
            }
        },
        scales: {
            x: {
                ticks: {
                    display: true,
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 2
                }
            }
        }
    };
}
