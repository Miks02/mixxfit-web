import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
    ChartConfiguration,
    ChartOptions,
    ChartType,
    Chart, registerables
} from 'chart.js';
Chart.register(...registerables)

@Component({
    selector: 'app-workouts-chart',
    imports: [BaseChartDirective],
    templateUrl: './workouts-chart.html',
    styleUrl: './workouts-chart.css',
})
export class WorkoutsChart {
    public barChartType: 'bar' = "bar";

    public barChartData: ChartConfiguration<'bar'>['data'] = {
        labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        datasets: [
            {
                label: 'Workouts',
                data: [15, 14, 18, 9, 14, 16, 22, 17, 12, 14, 16, 20],
                borderRadius: 6,
                barPercentage: 1,
                categoryPercentage: 0.8,
                backgroundColor: 'rgba(235, 170, 11, 1)'
            }
        ]
    };

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
