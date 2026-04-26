import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { DashboardDto } from '../models/dasbhoard-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DashboardState {
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
