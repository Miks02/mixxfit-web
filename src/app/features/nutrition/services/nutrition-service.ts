import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { CalorieResult } from '../models/calorie-result';
import { HttpClient } from '@angular/common/http';
import { SetDailyCaloriesRequest } from '../models/set-daily-calories-request';
import { UserState } from '../../../core/states/user-state';

@Injectable({
    providedIn: 'root',
})
export class NutritionService {
    private api: string = environment.apiUrl + '/nutrition';

    private http = inject(HttpClient);
    private userState = inject(UserState);

    calculateCalories(request: SetDailyCaloriesRequest): Observable<CalorieResult>  {
        return this.http.post<CalorieResult>(`${this.api}/calorie-goals`, request)
    }

    setDailyCalories(request: number | null): Observable<{calories: number}> {
        return this.http.post<{calories: number}>(`${this.api}/daily-calories`, { calories: request }).pipe(
            tap((result) => {
                this.userState.updateUserDetails({ dailyCalorieGoal: result.calories });
            })
        );
    }

}
