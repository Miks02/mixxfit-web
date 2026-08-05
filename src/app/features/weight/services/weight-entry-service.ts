import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import {  lastValueFrom, shareReplay, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { WeightChartDto } from '../models/weight-chart';
import { CreateWeightRequest } from '../models/weight-create-request';
import { WeightEntryDetails } from '../models/weight-entry-details';
import { WeightListDetails } from '../models/weight-list-details';
import { WeightSummary } from '../models/weight-summary';
import {UserState} from '../../../core/states/user-state';
import {TargetWeightDto} from '../models/target-weight-dto';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';

@Injectable({
    providedIn: 'root',
})
export class WeightEntryService {
    private api = environment.apiUrl;

    private queryClient = inject(QueryClient);
    private http = inject(HttpClient);
    private userState = inject(UserState);

    private _weightSummary: WritableSignal<WeightSummary | undefined> = signal(undefined);
    private _weightListDetails: WritableSignal<WeightListDetails | undefined> = signal(undefined);
    private _weightChart: WritableSignal<WeightChartDto | undefined> = signal(undefined);

    readonly weightSummary = this._weightSummary.asReadonly();
    readonly weightListDetails = this._weightListDetails.asReadonly();
    readonly weightChart = this._weightChart.asReadonly();

    weightSummaryQuery(month: Signal<number | null>, year: Signal<number | null>, targetWeight: Signal<number | null>) {
        const query = injectQuery(() => ({
            queryKey: ['weight-summary', targetWeight()],
            queryFn: async () => {
                const res = await lastValueFrom(this.getMyWeightSummary(month(), year(), targetWeight()));
                this.queryClient.setQueryData(['weight-list-details', month(), year()], res.weightListDetails);
                return res;
            },
            enabled: targetWeight() !== undefined
        }));

        return {
            data: query.data,
            isLoading: query.isLoading,
            isError: query.isError,
            isSuccess: query.isSuccess,
            error: query.error,
            status: query.status,
        };
    }

    weightListDetailsQuery(month: Signal<number | null>, year: Signal<number | null>) {
        const query = injectQuery(() => ({
            queryKey: ['weight-list-details', month(), year()],
            queryFn: async () => await lastValueFrom(this.getMyWeightLogs(month(), year())),
            enabled: month() !== null || year() !== null
        }));

        return {
            data: query.data,
            isLoading: query.isLoading,
            isError: query.isError,
            isSuccess: query.isSuccess,
            error: query.error,
            status: query.status,
        };
    }

    addWeightEntryMutation = injectMutation(() => ({
        mutationFn: async (request: CreateWeightRequest) => await lastValueFrom(this.http.post<WeightEntryDetails>(`${this.api}/weight-entries`, request)),
        onSuccess: () => {
            this.queryClient.invalidateQueries({queryKey: ['weight-list-details']})
            this.queryClient.invalidateQueries({queryKey: ['weight-summary']})
        }
    }));


    setWeightSummary(summary: Partial<WeightSummary>) {
        this._weightSummary.update((current) => ({...current, ...summary} as WeightSummary));
    }

    getMyWeightSummary(month: number | null = null, year: number | null = null, targetWeight: number | null = null) {
        let params = new HttpParams()

        if(month !== null && month !== undefined) {
            params = params.set('month', month as number)
        }

        if(year !== null && year !== undefined) {
            params = params.set('year', year as number)
        }

        if(targetWeight !== null && targetWeight !== undefined) {
            params = params.set('targetWeight', targetWeight as number)
        }

        return this.http.get<WeightSummary>(`${this.api}/weight-entries`, {params})
    }

    getMyWeightLogs(month: number | null = null, year: number | null = null) {
        let params = new HttpParams();

        if(month !== null && month !== undefined) {
            params = params.set('month', month as number)
        }

        if(year !== null && year !== undefined) {
            params = params.set('year', year as number)

        }

        return this.http.get<WeightListDetails>(`${this.api}/weight-entries/logs`, {params})
    }

    getMyWeightLog(id: number) {
        return this.http.get<WeightEntryDetails>(`${this.api}/weight-entries/${id}`);
    }

    getMyWeightChart(targetWeight: number | null = null) {
        this._weightChart.set(undefined);
        let params = new HttpParams();

        if(targetWeight != null) {
            params = params.set('targetWeight', targetWeight as number)
        }

        return this.http.get<WeightChartDto>(`${this.api}/weight-entries/weight-chart`, {params})
    }

    addWeightEntry(request: CreateWeightRequest) {
        return this.http.post<WeightEntryDetails>(`${this.api}/weight-entries`, request);
    }

    deleteWeightEntry(id: number) {
        return this.http.delete<void>(`${this.api}/weight-entries/${id}`);
    }

    updateTargetWeight(targetWeight: TargetWeightDto) {
        return this.http.patch<TargetWeightDto>(`${this.api}/fitness-profile/target-weight`, targetWeight)
            .pipe(
                tap((res) => {
                    this.userState.updateUserDetails({targetWeight: res.targetWeight})
                })
            );
    }

}
