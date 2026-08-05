import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DashboardDto } from '../models/dasbhoard-dto';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private api = environment.apiUrl;
    private http = inject(HttpClient);

    dashboardQuery() {
        return injectQuery(() => ({
            queryKey: ['dashboard'],
            queryFn: () => lastValueFrom(this.getDashboard()),
        }));
    }

    readonly dashboardData = this.dashboardQuery().data;

    private getDashboard() {
        return this.http.get<DashboardDto>(`${this.api}/dashboard`)
    }

}
