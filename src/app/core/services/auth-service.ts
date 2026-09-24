import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { lastValueFrom, map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../../features/auth/models/auth-response';
import { ForgotPasswordRequest } from '../../features/auth/models/forgot-password-request';
import { LoginRequest } from '../../features/auth/models/login-request';
import { ResetPasswordRequest } from '../../features/auth/models/reset-password-request';
import { RegisterRequest } from '../../features/auth/models/register-request';
import { UserState } from '../states/user-state';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { ProblemDetails } from '../models/problem-details';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly api: string = environment.apiUrl;
    private _accessToken: WritableSignal<string | null> = signal(localStorage.getItem('token'));
    public accessToken: Signal<string | null> = this._accessToken.asReadonly();

    private readonly http = inject(HttpClient);
    private userState = inject(UserState);

    setAccessToken(accessToken: string | null) {
        this._accessToken.set(accessToken);

        if (accessToken === null) localStorage.removeItem('token');
        else localStorage.setItem('token', accessToken as string);
    }

    registerMutation = injectMutation<AuthResponse, ProblemDetails, RegisterRequest>(() => ({
        mutationFn: async (model: RegisterRequest) => await lastValueFrom(this.register(model)),
        onSuccess: (res) => {
            this.setAccessToken(res.accessToken);
            this.userState.setUserDetails(res.user);
        },
    }));

    loginMutation = injectMutation<AuthResponse, ProblemDetails, LoginRequest>(() => ({
        mutationFn: async (model: LoginRequest) => await lastValueFrom(this.login(model)),
        onSuccess: (res) => {
            this.setAccessToken(res.accessToken);
            this.userState.setUserDetails(res.user);
        },
    }));

    logoutMutation = injectMutation<void, ProblemDetails, void>(() => ({
        mutationFn: async () => await lastValueFrom(this.logout()),
        onMutate: () => {
            this.clearAuthData();
            window.location.href = '/';
        },
    }));

    private cooldownInterval: ReturnType<typeof setInterval> | null = null;
    cooldownDuration = signal(0);
    isOnCooldown = computed(() => this.cooldownDuration() > 0);

    forgotPasswordMutation = injectMutation<void, ProblemDetails, ForgotPasswordRequest>(() => ({
        mutationFn: async (model: ForgotPasswordRequest) => await lastValueFrom(this.forgotPassword(model)),
        onMutate: () => this.beginCooldown(),
    }));

    resetPasswordMutation = injectMutation<void, ProblemDetails, ResetPasswordRequest>(() => ({
        mutationFn: async (model: ResetPasswordRequest) => await lastValueFrom(this.resetPassword(model)),
    }));

    private beginCooldown() {
        if (this.cooldownInterval) clearInterval(this.cooldownInterval);

        this.cooldownDuration.set(60);

        this.cooldownInterval = setInterval(() => {
            this.cooldownDuration.update((duration) => duration - 1);

            if (this.cooldownDuration() <= 0 && this.cooldownInterval) {
                clearInterval(this.cooldownInterval);
                this.cooldownInterval = null;
            }
        }, 1000);
    }

    private forgotPassword(model: ForgotPasswordRequest): Observable<void> {
        return this.http.post<void>(`${this.api}/auth/forgot-password`, model);
    }

    private resetPassword(model: ResetPasswordRequest): Observable<void> {
        return this.http.post<void>(`${this.api}/auth/reset-password`, model);
    }

    private register(model: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.api}/auth/register`, model, {
            withCredentials: true,
        });
    }

    private login(model: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.api}/auth/login`, model, {
            withCredentials: true,
        });
    }

    private logout(): Observable<void> {
        return this.http.post<void>(`${this.api}/auth/logout`, {}, { withCredentials: true });
    }

    rotateAuthTokens(): Observable<string> {
        return this.http
            .post<AuthResponse>(
                `${this.api}/auth/refresh-token`,
                {},
                {
                    withCredentials: true,
                },
            )
            .pipe(map((res: any) => res.accessToken));
    }

    isAuthenticated() {
        if (this.accessToken()) return true;
        return false;
    }

    clearAuthData() {
        this.setAccessToken(null);
        localStorage.clear();
    }
}
