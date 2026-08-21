import { Component, computed, Input, signal, Signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ApexOptions } from 'apexcharts';
import {
    NgApexchartsModule
} from 'ng-apexcharts';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { WeightChart as WeightChartModel } from '../../models/weight-chart';

@Component({
    selector: 'app-weight-chart',
    standalone: true,
    imports: [NgApexchartsModule, NgxSkeletonLoaderComponent, NgIcon],
    templateUrl: './weight-chart.html',
    styleUrl: './weight-chart.css',
})
export class WeightChart {
    @Input()
    weightDataSource: Signal<WeightChartModel | undefined> = signal(undefined);

    public chartOptions = computed<ApexOptions>(() => {
        const data = this.weightDataSource();

        if (!data || !data.entries || data.entries.length === 0) {
            return {
                series: [],
                chart: { type: 'line', height: 350 },
                xaxis: { categories: [] },
            };
        }

        const sortedEntries = [...data.entries].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

        const labels = sortedEntries.map((entry) => new Date(entry.createdAt).toLocaleDateString());
        const weights = sortedEntries.map((entry) => entry.weight);

        return {
            series: [
                {
                    name: 'Weight (kg)',
                    type: 'area',
                    data: weights,
                },
                {
                    name: 'Target Weight (kg)',
                    type: 'line',
                    data: Array(weights.length).fill(data.targetWeight),
                },
            ],
            chart: {
                type: 'line',
                height: '100%',
                toolbar: { show: false },
                zoom: { enabled: false },
            },
            responsive: [
                {
                    breakpoint: 600,
                    options: {
                        chart: { height: 250 },
                        legend: { position: 'bottom' },
                    },
                },
            ],
            colors: ['#8B5CF6', '#22C55E'],
            stroke: {
                curve: 'smooth',
                width: [3, 3],
                dashArray: [0, 2],
            },
            fill: {
                type: ['gradient', 'solid'],
                gradient: {
                    shadeIntensity: 0,
                    opacityFrom: 0.35,
                    opacityTo: 0.35,
                    stops: [0, 100],
                },
            },
            markers: {
                size: [4, 0],
                hover: { size: 5 },
            },
            dataLabels: { enabled: false },
            legend: { show: true, position: 'bottom' },
            tooltip: { shared: true, intersect: false },
            grid: {
                xaxis: { lines: { show: false } },
            },
            xaxis: {
                categories: labels,
                axisBorder: { show: false },
                axisTicks: { show: false },
            },
        };
    });
}
