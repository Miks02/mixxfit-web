import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../core/services/user-service';
import { WeightChartDto } from '../models/weight-chart';
import { CreateWeightRequest } from '../models/weight-create-request';
import { WeightEntryDetails } from '../models/weight-entry-details';
import { WeightListDetails } from '../models/weight-list-details';
import { WeightSummary } from '../models/weight-summary';

@Injectable({
  providedIn: 'root',
})
export class WeightEntryService {
  private api = environment.apiUrl;

  private http = inject(HttpClient);
  private userService = inject(UserService);

  private weightSummarySubject = new BehaviorSubject<WeightSummary| undefined>(undefined);
  private weightListDetailsSubject = new BehaviorSubject<WeightListDetails| undefined>(undefined);
  private weightChartSubject = new BehaviorSubject<WeightChartDto | undefined>(undefined);

  weightSummary$ = this.weightSummarySubject.asObservable();
  weightListDetails$ = this.weightListDetailsSubject.asObservable();
  weightChart$ = this.weightChartSubject.asObservable();

  set weightSummary(summary: Partial<WeightSummary>) {
    const current = this.weightSummarySubject.getValue() as WeightSummary;
    this.weightSummarySubject.next({...current, ...summary});
  }

  getMyWeightSummary(month: number | null = null, year: number | null = null, targetWeight: number | null = null) {
    let params = new HttpParams()

    console.warn(month)
    console.warn(year)

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
        this.weightSummary = {
          firstEntry: res.firstEntry,
          currentWeight: res.currentWeight,
          progress: res.progress,
          years: res.years,
          weightChart: res.weightChart

        }
        this.weightListDetailsSubject.next(res.weightListDetails);
        this.weightChartSubject.next(res.weightChart);
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
        this.weightListDetailsSubject.next(res);
      })
    );
  }

  getMyWeightLog(id: number) {
    return this.http.get<WeightEntryDetails>(`${this.api}/weight-entries/${id}`);
  }

  getMyWeightChart(targetWeight: number | null = null) {
    let params = new HttpParams();

    if(targetWeight != null && targetWeight != undefined) {
      params.set('targetWeight', targetWeight as number)
    }

    return this.http.get<WeightChartDto>(`${this.api}/weight-entries/weight-chart`, {params})
    .pipe(
      tap(res => {
        this.weightChartSubject.next(res);
        this.weightSummary = {
          weightChart: res
        }
      })
    )
  }

  addWeightEntry(request: CreateWeightRequest) {
    return this.http.post<WeightEntryDetails>(`${this.api}/weight-entries`, request);
  }

  deleteWeightEntry(id: number) {
    return this.http.delete<void>(`${this.api}/weight-entries/${id}`);
  }

}
