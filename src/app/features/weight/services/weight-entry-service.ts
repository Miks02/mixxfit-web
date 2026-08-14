import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
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

@Injectable({
    providedIn: 'root',
})
export class WeightEntryService {
    private api = environment.apiUrl;

    private queryClient = inject(QueryClient);
    private http = inject(HttpClient);
    private userState = inject(UserState);

    weightSummaryQuery(month: Signal<number | null>, year: Signal<number | null>, targetWeight: Signal<number | null>) {
        return injectQuery<WeightSummary, ProblemDetails>(() => ({
            queryKey: ['weight-summary', targetWeight()],
            queryFn: async () => {
                const res = await lastValueFrom(this.getMyWeightSummary(month(), year(), targetWeight()));
                this.queryClient.setQueryData(['weight-list-details', month(), year()], res.weightListDetails);
                this.queryClient.setQueryData(['weight-chart', targetWeight()], res.weightChart)
                this.userState.updateUserDetails({currentWeight: res.currentWeight.weight})
                return res;
            },
            enabled: targetWeight() !== undefined
        }));
    }

    weightListDetailsQuery(month: Signal<number | null>, year: Signal<number | null>) {
        return injectQuery<WeightListDetails, ProblemDetails>(() => ({
            queryKey: ['weight-list-details', month(), year()],
            queryFn: async () => await lastValueFrom(this.getMyWeightLogs(month(), year())),
            enabled: month() !== null || year() !== null
        }));

    }

    weightChartQuery(targetWeight: Signal<number | null>) {
        return injectQuery<WeightChart, ProblemDetails>(() => ({
            queryKey: ['weight-chart', targetWeight()],
            queryFn: async () => await lastValueFrom(this.getMyWeightChart(targetWeight())),
        }));
    }

    addWeightEntryMutation = injectMutation<WeightEntryDetails, ProblemDetails, CreateWeightRequest>(() => ({
        mutationFn: async (request: CreateWeightRequest) => await lastValueFrom(this.addWeightEntry(request)),
        onSuccess: (res) => {
            this.queryClient.invalidateQueries({ queryKey: ['weight-summary'] })
        }
    }));

    deleteWeightEntryMutation = injectMutation<void, ProblemDetails, number>(() => ({
        mutationFn: async (id: number) => await lastValueFrom(this.deleteWeightEntry(id)),
        onSuccess: () => {
            this.queryClient.invalidateQueries({ queryKey: ['weight-summary'] })
        }
    }));

    updateTargetWeightMutation = injectMutation<TargetWeightDto, ProblemDetails, TargetWeightDto>(() => ({
        mutationFn: async (targetWeight: TargetWeightDto) => await lastValueFrom(this.updateTargetWeight(targetWeight)),
        onSuccess: (res) => {
            this.queryClient.invalidateQueries({ queryKey: ['weight-chart'] })
            this.userState.updateUserDetails({targetWeight: res.targetWeight})
        }
    }));

    private getMyWeightSummary(month: number | null = null, year: number | null = null, targetWeight: number | null = null) {
        let params = new HttpParams()

        if(month !== null)
            params = params.set('month', month as number)

        if(year !== null)
            params = params.set('year', year as number)

        if(targetWeight !== null)
            params = params.set('targetWeight', targetWeight as number)

        return this.http.get<WeightSummary>(`${this.api}/weight-entries`, {params})
    }

    private getMyWeightLogs(month: number | null = null, year: number | null = null) {
        let params = new HttpParams();

        if(month !== null)
            params = params.set('month', month as number)

        if(year !== null)
            params = params.set('year', year as number)

        return this.http.get<WeightListDetails>(`${this.api}/weight-entries/logs`, {params})
    }

    private getMyWeightChart(targetWeight: number | null = null) {
        let params = new HttpParams();

        if(targetWeight != null) {
            params = params.set('targetWeight', targetWeight as number)
        }

        return this.http.get<WeightChart>(`${this.api}/weight-entries/weight-chart`, {params})
    }

    private addWeightEntry(request: CreateWeightRequest) {
        return this.http.post<WeightEntryDetails>(`${this.api}/weight-entries`, request);
    }

    private deleteWeightEntry(id: number) {
        return this.http.delete<void>(`${this.api}/weight-entries/${id}`);
    }

    private updateTargetWeight(targetWeight: TargetWeightDto) {
        return this.http.patch<TargetWeightDto>(`${this.api}/fitness-profile/target-weight`, targetWeight)
    }

}
