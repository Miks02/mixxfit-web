import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DashboardDto } from '../models/dasbhoard-dto';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private api = environment.apiUrl;

    private _dashboard: WritableSignal<DashboardDto | undefined> = signal(undefined);
    public dashboard = this._dashboard.asReadonly();

    private http = inject(HttpClient);

    getDashboard() {
        return this.http.get<DashboardDto>(`${this.api}/dashboard`).pipe(
            tap((res) => this._dashboard.set(res))
        )
    }

}
