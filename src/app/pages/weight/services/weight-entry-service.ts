import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserService } from '../../../core/services/user-service';
import { WeightCreateRequestDto } from '../models/WeightCreateRequestDto';
import { environment } from '../../../../environments/environment.development';
import { WeightEntryDetailsDto } from '../models/WeightEntryDetailsDto';
import { BehaviorSubject, tap } from 'rxjs';
import { WeightSummaryDto } from '../models/WeightSummaryDto';
import { WeightRecordDto } from '../models/WeightRecordDto';
import { WeightListDetailsDto } from '../models/WeightListDetailsDto';

@Injectable({
  providedIn: 'root',
})
export class WeightEntryService {
    private api = environment.apiUrl;

    private http = inject(HttpClient);
    private userService = inject(UserService);

    private weightSummarySubject = new BehaviorSubject<WeightSummaryDto | undefined>(undefined);
    private weightListDetailsSubject = new BehaviorSubject<WeightListDetailsDto | undefined>(undefined);

    weightSummary$ = this.weightSummarySubject.asObservable();
    weightListDetails$ = this.weightListDetailsSubject.asObservable();

    set weightSummary(summary: Partial<WeightSummaryDto>) {
        const current = this.weightSummarySubject.getValue() as WeightSummaryDto;
        this.weightSummarySubject.next({...current, ...summary});
    }

    getMyWeightSummary(month: number | null = null, year: number | null = null) {
        const params = new HttpParams()
            .set('month', month as number)
            .set('year', year as number)

        return this.http.get<WeightSummaryDto>(`${this.api}/weight-entries`, {params})
            .pipe(
                tap(res => {
                    this.weightSummary = {
                        firstEntry: res.firstEntry,
                        currentWeight: res.currentWeight,
                        progress: res.progress,
                        years: res.years
                    }
                    this.weightListDetailsSubject.next(res.weightListDetails);
                    this.userService.userDetails = {currentWeight: res.currentWeight.weight};
                })
            )
    }

    getMyWeightLogs(month: number | null = null, year: number | null = null) {
        const params = new HttpParams()
            .set('month', month as number)
            .set('year', year as number)


        return this.http.get<WeightListDetailsDto>(`${this.api}/weight-entries/logs`, {params})
            .pipe(
                tap(res => {
                    this.weightListDetailsSubject.next(res);
                })
            );
    }

    getMyWeightLog(id: number) {
        return this.http.get<WeightEntryDetailsDto>(`${this.api}/weight-entries/${id}`);
    }

    addWeightEntry(request: WeightCreateRequestDto) {
        return this.http.post<WeightEntryDetailsDto>(`${this.api}/weight-entries`, request);
    }

    deleteWeightEntry(id: number) {
        return this.http.delete<void>(`${this.api}/weight-entries/${id}`);
    }

}
