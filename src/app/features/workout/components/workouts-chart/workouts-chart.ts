import { Component, computed, input, Input, NgModule, signal, Signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { WorkoutsPerMonthDto } from '../../models/workouts-per-month-dto';
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexNonAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexYAxis,
    ApexTitleSubtitle,
    ApexDataLabels,
    ApexStroke,
    ApexFill,
    ApexLegend,
    ApexTooltip,
    ApexMarkers,
    ApexPlotOptions,
    ApexResponsive,
    ApexGrid,
    ApexAnnotations,
    ApexStates,
    ApexTheme,
    NgApexchartsModule,
} from 'ng-apexcharts';
import { NgIcon } from '@ng-icons/core';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

export type ChartOptions = {
    series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
    chart?: ApexChart;
    xaxis?: ApexXAxis;
    yaxis?: ApexYAxis | ApexYAxis[];
    title?: ApexTitleSubtitle;
    subtitle?: ApexTitleSubtitle;
    dataLabels?: ApexDataLabels;
    stroke?: ApexStroke;
    fill?: ApexFill;
    legend?: ApexLegend;
    tooltip?: ApexTooltip;
    markers?: ApexMarkers;
    plotOptions?: ApexPlotOptions;
    responsive?: ApexResponsive[];
    grid?: ApexGrid;
    annotations?: ApexAnnotations;
    states?: ApexStates;
    theme?: ApexTheme;
    colors?: string[];
    labels?: any;
};

@Component({
    selector: 'app-workouts-chart',
    imports: [BaseChartDirective, NgApexchartsModule, NgIcon, NgxSkeletonLoaderComponent],
    templateUrl: './workouts-chart.html',
    styleUrl: './workouts-chart.css',
    host: {
        class: 'flex flex-col min-w-75',
    },
})
export class WorkoutsChart {
    workoutCountsSource = input.required<WorkoutsPerMonthDto | undefined>();
    availableYears = input.required<number[] | undefined>();

    chartOptions = computed<Partial<ChartOptions>>(() => {
        const data = this.workoutCountsSource();
        return {
            series: [
                {
                    name: 'Workouts',
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
                        data?.decemberWorkouts ?? 0,
                    ],
                },
            ],
            chart: {
                type: 'bar',
                height: 250,

                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '85%',
                    borderRadius: 5,
                    borderRadiusApplication: 'end',
                },
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            xaxis: {
                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ],
                labels: {
                    style: {
                        fontSize: '12px',
                    },
                },
            },
            fill: {
                opacity: 1,
                colors: ['orange'],
            },
            responsive: [
                {
                    breakpoint: 600,
                    options: {
                        chart: {
                            height: 250,
                        },
                        plotOptions: {
                            bar: {
                                columnWidth: '90%',
                                borderRadius: 5,
                            },
                        },
                        xaxis: {
                            labels: {
                                rotate: -45,
                                style: {
                                    fontSize: '10px',
                                },
                            },
                        },
                    },
                },
            ],
        };
    });
}
