import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../../features/auth/models/auth-response';
import { LoginRequest } from '../../features/auth/models/login-request';
import { RegisterRequest } from '../../features/auth/models/register-request';
import { UserState } from '../states/user-state';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly api: string = environment.apiUrl;
    private _accessToken: WritableSignal<string | null> = signal(localStorage.getItem('token'));
    public accessToken: Signal<string | null> = this._accessToken.asReadonly();

    private readonly http = inject(HttpClient)
    private userState = inject(UserState);

    setAccessToken(accessToken: string | null) {
        this._accessToken.set(accessToken);

        if(accessToken === null)
            localStorage.removeItem('token')
        else
            localStorage.setItem('token', accessToken as string)
    }

    register(model: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.api}/auth/register`, model, {withCredentials: true})
        .pipe(
            tap(res => {
                this.setAccessToken(res.accessToken);
                this.userState.setUserDetails(res.user);
            })
        )
    }

    login(model: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.api}/auth/login`, model , {withCredentials: true})
        .pipe(
            tap(res => {
                this.setAccessToken(res.accessToken);
                this.userState.setUserDetails(res.user);
            })
        )
    }

    logout(): Observable<void> {

        return this.http.post<void>(`${this.api}/auth/logout`,{}, {withCredentials: true})
        .pipe(
            tap(() => this.clearAuthData())
        )
    }

    rotateAuthTokens(): Observable<string> {
        return this.http.post<AuthResponse>(`${this.api}/auth/refresh-token`, {}, {
            withCredentials: true
        }).pipe(
            map((res: any) => res.accessToken)
        )
    }

    isAuthenticated() {
        if(this.accessToken()) return true;
        return false;
    }

    clearAuthData() {
        this.userState.resetCurrentUser();
        localStorage.removeItem('token');
        this.setAccessToken(null);
    }

}
