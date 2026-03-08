import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import {  tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { WeightChartDto } from '../models/weight-chart';
import { CreateWeightRequest } from '../models/weight-create-request';
import { WeightEntryDetails } from '../models/weight-entry-details';
import { WeightListDetails } from '../models/weight-list-details';
import { WeightSummary } from '../models/weight-summary';
import {UserState} from '../../../core/states/user-state';
import {TargetWeightDto} from '../models/target-weight-dto';

@Injectable({
    providedIn: 'root',
})
export class WeightEntryService {
    private api = environment.apiUrl;

    private http = inject(HttpClient);
    private userState = inject(UserState);

    private _weightSummary: WritableSignal<WeightSummary | undefined> = signal(undefined);
    private _weightListDetails: WritableSignal<WeightListDetails | undefined> = signal(undefined);
    private _weightChart: WritableSignal<WeightChartDto | undefined> = signal(undefined);

    readonly weightSummary = this._weightSummary.asReadonly();
    readonly weightListDetails = this._weightListDetails.asReadonly();
    readonly weightChart = this._weightChart.asReadonly();


    setWeightSummary(summary: Partial<WeightSummary>) {
        this._weightSummary.update((current) => ({...current, ...summary} as WeightSummary));
    }

    getMyWeightSummary(month: number | null = null, year: number | null = null, targetWeight: number | null = null) {
        this._weightChart.set(undefined);

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
        .pipe(
            tap(res => {
                this.setWeightSummary({
                    firstEntry: res.firstEntry,
                    currentWeight: res.currentWeight,
                    progress: res.progress,
                    years: res.years,
                    weightChart: res.weightChart

                });
                this._weightListDetails.set(res.weightListDetails);
                this._weightChart.set(res.weightChart);
            })
        )
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
        .pipe(
            tap(res => {
                this._weightListDetails.set(res);
            })
        );
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
        .pipe(
            tap(res => {
                this._weightChart.set(res);
                this.setWeightSummary({
                    weightChart: res
                });
            })
        )
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
