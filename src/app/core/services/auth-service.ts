import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { RegisterRequest } from '../models/RegisterRequest';
import { AuthResponse } from '../models/AuthResponse';
import { Observable, map, tap } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { UserDto } from '../models/UserDto';
import { LoginRequest } from '../models/LoginRequest';
import { Router } from '@angular/router';
import { UserService } from './user-service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly api: string = "https://localhost:7263/api";
    private accessTokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
    public accessToken$ = this.accessTokenSubject.asObservable();

    private readonly http = inject(HttpClient)
    private router = inject(Router);
    private userService = inject(UserService);

    get accessToken(): string | null {return this.accessTokenSubject.value}
    set accessToken(accessToken: string | null) {
        localStorage.setItem('token', accessToken as string)
        this.accessTokenSubject.next(accessToken)
    }

    constructor() {
        this.accessTokenSubject.next(this.accessToken)
    }

    register(model: RegisterRequest): Observable<UserDto> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.api}/auth/register`, model, {withCredentials: true})
        .pipe(
            tap(res => {
                this.accessToken = res.data.accessToken;
                this.userService.userDetails = res.data.user;
                this.router.navigate(['/dashboard']);
            }),
            map(res => res.data.user)
        )
    }

    login(model: LoginRequest): Observable<UserDto> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.api}/auth/login`, model , {withCredentials: true})
        .pipe(
            tap(res => {
                this.accessToken = res.data.accessToken;
                this.userService.userDetails = res.data.user;
                this.router.navigate(['/dashboard']);
            }),
            map(res => res.data.user),
        )
    }

    logout(): Observable<ApiResponse<void>> {

        return this.http.post<ApiResponse<void>>(`${this.api}/auth/logout`,{}, {withCredentials: true})
        .pipe(
            tap(() => {
                this.clearAuthData();
                this.router.navigate(['/login']);
            }), catchError((err) => {
                this.router.navigate(['/login']);
                return throwError(() => err)
            })
        )
    }

    rotateAuthTokens(): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(`${this.api}/auth/refresh-token`, {}, {
            withCredentials: true
        });
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
        this.userService.resetCurrentUser();
        this.accessTokenSubject.next(null);
    }

}
