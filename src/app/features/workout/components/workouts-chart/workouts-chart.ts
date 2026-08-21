import { Component, computed, input, output, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { ApexOptions } from 'apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { WorkoutsPerMonthDto } from '../../models/workouts-per-month-dto';

@Component({
    selector: 'app-workouts-chart',
    imports: [NgApexchartsModule, NgIcon, NgxSkeletonLoaderComponent, FormsModule],
    templateUrl: './workouts-chart.html',
    styleUrl: './workouts-chart.css',
    host: {
        class: 'flex flex-col min-w-75',
    },
})
export class WorkoutsChart {
    workoutCountsSource = input.required<WorkoutsPerMonthDto | undefined>();
    availableYears = input.required<number[] | undefined>();
    yearParam = output<number>();
    selectedYear: WritableSignal<number | null> = signal(null);

    onYearChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        this.selectedYear.set(Number(target.value));
        this.yearParam.emit(Number(target.value));
    }

    chartOptions = computed<ApexOptions>(() => {
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
            yaxis: {
                floating: false,
            },
            fill: {
                opacity: 1,
                colors: ['#eab308'],
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
