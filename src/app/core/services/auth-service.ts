import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { inject } from '@angular/core';
import { RegisterRequest } from '../../features/auth/models/register-request';
import { AuthResponse } from '../../features/auth/models/auth-response';
import { Observable, map, tap } from 'rxjs';
import { LoginRequest } from '../../features/auth/models/login-request';
import { UpdatePasswordDto } from '../models/User/UpdatePasswordDto';
import { environment } from '../../../environments/environment';
import { UserState } from '../states/user-state';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly api: string = environment.apiUrl;
    private accessTokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
    public accessToken$ = this.accessTokenSubject.asObservable();

    private readonly http = inject(HttpClient)
    private userState = inject(UserState);

    get accessToken(): string | null {return this.accessTokenSubject.value}
    set accessToken(accessToken: string | null) {
        this.accessTokenSubject.next(accessToken)

        if(accessToken === null)
            localStorage.removeItem('token')
        else
            localStorage.setItem('token', accessToken as string)
    }

    constructor() {
        this.accessTokenSubject.next(this.accessToken)
    }

    register(model: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.api}/auth/register`, model, {withCredentials: true})
        .pipe(
            tap(res => {
                this.accessToken = res.accessToken;
                this.userState.setUserDetails(res.user);
            })
        )
    }

    login(model: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.api}/auth/login`, model , {withCredentials: true})
        .pipe(
            tap(res => {
                this.accessToken = res.accessToken;
                this.userState.setUserDetails(res.user);
            })
        )
    }

    changePassword(model: UpdatePasswordDto): Observable<void> {
        return this.http.post<void>(`${this.api}/auth/password`, model)
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

    test(): Observable<void> {
        return this.http.get<void>(`${this.api}/auth/test`).pipe(
            tap(res => console.log(res))
        );
    }

    isAuthenticated() {
        if(this.accessToken) return true;
        return false;
    }

    clearAuthData() {
        this.userState.resetCurrentUser();
        localStorage.removeItem('token');
        this.accessTokenSubject.next(null);
    }

}
