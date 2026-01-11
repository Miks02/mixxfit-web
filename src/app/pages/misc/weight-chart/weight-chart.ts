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
    selector: 'app-weight-chart',
    imports: [BaseChartDirective],
    templateUrl: './weight-chart.html',
    styleUrl: './weight-chart.css',
})
export class WeightChart {
    public barChartType: 'line' = 'line';

    public barChartData: ChartConfiguration<'line'>['data'] = {
        labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        datasets: [
            {
                label: 'Weight (kg)',
                data: [82, 81.5, 81, 80.8, 80, 79.5, 79, 78.7, 78.5, 78, 77.5, 77],
                borderColor: 'rgba(234, 179, 8, 1)',
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                fill: true,
                tension: 0.35,
                pointRadius: 3,
                pointHoverRadius: 5
            }
        ]
    };

    public barChartOptions: ChartOptions<'line'> = {
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
                beginAtZero: false,
                ticks: {
                    // leave automatic step sizing; set a reasonable step if desired
                    stepSize: 1
                }
            }
        }
    };
}
