import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { lastValueFrom, Observable } from 'rxjs';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { CalorieResult } from '../models/calorie-result';
import { HttpClient } from '@angular/common/http';
import { SetDailyCaloriesRequest } from '../models/set-daily-calories-request';
import { ProblemDetails } from '../../../core/models/problem-details';
import { UserState } from '../../../core/states/user-state';

@Injectable({
    providedIn: 'root',
})
export class NutritionService {
    private api: string = environment.apiUrl + '/nutrition';

    private http = inject(HttpClient);
    private userState = inject(UserState);

    calculateCaloriesMutation = injectMutation<CalorieResult, ProblemDetails, SetDailyCaloriesRequest>(() => ({
        mutationFn: async (request: SetDailyCaloriesRequest) => await lastValueFrom(this.calculateCalories(request)),
    }));

    setDailyCaloriesMutation = injectMutation<{calories: number}, ProblemDetails, number | null>(() => ({
        mutationFn: async (request: number | null) => await lastValueFrom(this.setDailyCalories(request)),
        onSuccess: (res) => {
            this.userState.updateUserDetails({ dailyCalorieGoal: res.calories });
        }
    }));

    private calculateCalories(request: SetDailyCaloriesRequest): Observable<CalorieResult>  {
        return this.http.post<CalorieResult>(`${this.api}/calorie-goals`, request)
    }

    private setDailyCalories(request: number | null): Observable<{calories: number}> {
        return this.http.post<{calories: number}>(`${this.api}/daily-calories`, { calories: request })
    }

}
