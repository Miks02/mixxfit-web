import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import {
    CreateQueryResult,
    injectMutation,
    injectQuery,
    QueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProblemDetails } from '../../../core/models/problem-details';
import { UserState } from '../../../core/states/user-state';
import { TargetWeightDto } from '../models/target-weight-dto';
import { WeightChart } from '../models/weight-chart';
import { CreateWeightRequest } from '../models/weight-create-request';
import { WeightEntryDetails } from '../models/weight-entry-details';
import { WeightListDetails } from '../models/weight-list-details';
import { WeightSummary } from '../models/weight-summary';
import { format } from 'date-fns';

@Injectable({
    providedIn: 'root',
})
export class WeightEntryService {
    private api = environment.apiUrl;

    private queryClient = inject(QueryClient);
    private http = inject(HttpClient);
    private userState = inject(UserState);

    weightSummaryQuery(
        filterParams: Signal<{ year: number | null; month: number | null }>,
        targetWeight: Signal<number | null>,
    ) {
        return injectQuery<WeightSummary, ProblemDetails>(() => ({
            queryKey: ['weight-summary', targetWeight()],
            queryFn: async () => {
                const res = await lastValueFrom(
                    this.getMyWeightSummary(
                        filterParams().month,
                        filterParams().year,
                        targetWeight(),
                    ),
                );
                this.queryClient.setQueryData(
                    ['weight-list-details', filterParams().month, filterParams().year],
                    res.weightListDetails,
                );
                this.queryClient.setQueryData(['weight-chart', targetWeight()], res.weightChart);
                const currentWeight = res.currentWeight?.weight ?? null;
                if (currentWeight)
                    this.userState.updateUserDetails({ currentWeight: currentWeight });
                return res;
            },
            select: (data) => this.projectWeightSummary(data),
            enabled: targetWeight() !== undefined,
        }));
    }

    weightListDetailsQuery(
        filterParams: Signal<{ year: number | null; month: number | null }>,
        summaryQueryResult: CreateQueryResult<WeightSummary, ProblemDetails>,
    ) {
        return injectQuery<WeightListDetails, ProblemDetails>(() => ({
            queryKey: ['weight-list-details', filterParams().month, filterParams().year],
            queryFn: async () =>
                await lastValueFrom(
                    this.getMyWeightLogs(filterParams().month, filterParams().year),
                ),
            select: (data) => ({
                ...data,
                weightLogs: data.weightLogs.map((log) => ({
                    ...log,
                    createdAt: format(log.createdAt, 'MMM d, yyyy'),
                })),
            }),
            enabled: summaryQueryResult.isSuccess(),
        }));
    }

    weightChartQuery(targetWeight: Signal<number | null>) {
        return injectQuery<WeightChart, ProblemDetails>(() => ({
            queryKey: ['weight-chart', targetWeight()],
            queryFn: async () => await lastValueFrom(this.getMyWeightChart(targetWeight())),
        }));
    }

    addWeightEntryMutation = injectMutation<
        WeightEntryDetails,
        ProblemDetails,
        CreateWeightRequest
    >(() => ({
        mutationFn: async (request: CreateWeightRequest) =>
            await lastValueFrom(this.addWeightEntry(request)),
        onSuccess: () => {
            console.log('Servis prvo');
            this.queryClient.invalidateQueries({ queryKey: ['weight-summary'] });
        },
    }));

    deleteWeightEntryMutation = injectMutation<void, ProblemDetails, number>(() => ({
        mutationFn: async (id: number) => await lastValueFrom(this.deleteWeightEntry(id)),
        onSuccess: () => {
            this.queryClient.invalidateQueries({ queryKey: ['weight-summary'] });
        },
    }));

    updateTargetWeightMutation = injectMutation<TargetWeightDto, ProblemDetails, TargetWeightDto>(
        () => ({
            mutationFn: async (targetWeight: TargetWeightDto) =>
                await lastValueFrom(this.updateTargetWeight(targetWeight)),
            onSuccess: (res) => {
                this.queryClient.invalidateQueries({ queryKey: ['weight-chart'] });
                this.userState.updateUserDetails({ targetWeight: res.targetWeight });
            },
        }),
    );

    private getMyWeightSummary(
        month: number | null = null,
        year: number | null = null,
        targetWeight: number | null = null,
    ) {
        let params = new HttpParams();

        if (month !== null) params = params.set('month', month as number);

        if (year !== null) params = params.set('year', year as number);

        if (targetWeight !== null) params = params.set('targetWeight', targetWeight as number);

        return this.http.get<WeightSummary>(`${this.api}/weight-entries`, { params });
    }

    private getMyWeightLogs(month: number | null = null, year: number | null = null) {
        let params = new HttpParams();

        if (month !== null) params = params.set('month', month as number);

        if (year !== null) params = params.set('year', year as number);

        return this.http.get<WeightListDetails>(`${this.api}/weight-entries/logs`, { params });
    }

    private getMyWeightChart(targetWeight: number | null = null) {
        let params = new HttpParams();

        if (targetWeight != null) {
            params = params.set('targetWeight', targetWeight as number);
        }

        return this.http.get<WeightChart>(`${this.api}/weight-entries/weight-chart`, { params });
    }

    private addWeightEntry(request: CreateWeightRequest) {
        return this.http.post<WeightEntryDetails>(`${this.api}/weight-entries`, request);
    }

    private deleteWeightEntry(id: number) {
        return this.http.delete<void>(`${this.api}/weight-entries/${id}`);
    }

    private updateTargetWeight(targetWeight: TargetWeightDto) {
        return this.http.patch<TargetWeightDto>(
            `${this.api}/fitness-profile/target-weight`,
            targetWeight,
        );
    }

    private projectWeightSummary(summary: WeightSummary) {
        return {
            ...summary,
            currentWeight:
                summary.currentWeight !== null
                    ? {
                          ...summary.currentWeight,
                          createdAt: format(summary.currentWeight.createdAt, 'MMM d, yyyy'),
                      }
                    : null,
            weightDelta:
                summary.weightDelta != null
                    ? {
                          ...summary.weightDelta,
                          createdAt: format(summary.weightDelta.createdAt, 'MMM d, yyyy'),
                      }
                    : null,
            weightListDetails: summary.weightListDetails
                ? {
                      ...summary.weightListDetails,
                      weightLogs:
                          summary.weightListDetails.weightLogs?.map((log) => ({
                              ...log,
                              createdAt: format(log.createdAt, 'MMM d, yyyy'),
                          })) ?? [],
                  }
                : { weightLogs: [], months: [] },
        }
    }
}
