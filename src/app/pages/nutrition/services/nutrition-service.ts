import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CalorieResult } from '../models/CalorieResult';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../core/services/user-service';
import { SetDailyCaloriesRequest } from '../models/SetDailyCaloriesRequest';

@Injectable({
  providedIn: 'root',
})
export class NutritionService {
  private api: string = environment.apiUrl + '/nutrition';

  private http = inject(HttpClient);
  private userService = inject(UserService);

  calculateCalories(request: SetDailyCaloriesRequest): Observable<CalorieResult>  {
    return this.http.post<CalorieResult>(`${this.api}/calorie-goals`, request)
  }

  setDailyCalories(request: number | null): Observable<{calories: number}> {
    return this.http.post<{calories: number}>(`${this.api}/daily-calories`, { calories: request }).pipe(
      tap((result) => {
        this.userService.userDetails.dailyCalorieGoal = result.calories;
      })
    );
  }

}
