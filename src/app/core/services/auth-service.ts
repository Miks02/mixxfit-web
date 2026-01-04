import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { inject } from '@angular/core';
import { RegisterRequest } from '../models/RegisterRequest';
import { AuthResponse } from '../models/AuthResponse';
import { Observable, map, tap } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { UserDto } from '../models/UserDto';
import { LoginRequest } from '../models/LoginRequest';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly api: string = "https://localhost:7263/api";
    private accessTokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
    public accessToken$ = this.accessTokenSubject.asObservable();

    private userSubject = new BehaviorSubject<UserDto | null>(null);
    public user$ = this.userSubject.asObservable();

    private readonly http = inject(HttpClient)
    private router = inject(Router);

    get accessToken(): string | null {return this.accessTokenSubject.value}
    set accessToken(accessToken: string | null) {
        localStorage.setItem('token', accessToken as string)
        this.accessTokenSubject.next(accessToken)
    }

    get userData(): UserDto {
        const user: UserDto = {
            firstName: localStorage.getItem('firstName') as string,
            lastName: localStorage.getItem('lastName') as string,
            userName: localStorage.getItem('userName') as string,
            email: localStorage.getItem('email') as string
        };

        return user;
    }
    set userData(data: UserDto) {
        localStorage.setItem('firstName', data.firstName);
        localStorage.setItem('lastName', data.lastName);
        localStorage.setItem('userName', data.userName);
        localStorage.setItem('email', data.email);

        this.userSubject.next(this.userData);
    }

    constructor() {
        this.accessTokenSubject.next(this.accessToken)
        this.userSubject.next(this.userData);
    }

    register(model: RegisterRequest): Observable<UserDto> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.api}/auth/register`, model, {withCredentials: true})
        .pipe(
            tap(res => {
                this.accessToken = res.data.accessToken;
                this.userData = res.data.user
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
                this.userData = res.data.user;
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
        localStorage.removeItem('token');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('userName');
        localStorage.removeItem('email');

        this.accessTokenSubject.next(null);
        this.userSubject.next(null);
    }

    buildUserData(data: UserDto): UserDto {
        localStorage.setItem('firstName', data.firstName);
        localStorage.setItem('lastName', data.lastName);
        localStorage.setItem('userName', data.userName);
        localStorage.setItem('email', data.email);

        const user: UserDto = {
            firstName: localStorage.getItem('firstName') as string,
            lastName: localStorage.getItem('lastName') as string,
            userName: localStorage.getItem('userName') as string,
            email: localStorage.getItem('email') as string
        };

        return user;
    }

    getUserData(): UserDto {
        const user: UserDto = {
            firstName: localStorage.getItem('firstName') as string,
            lastName: localStorage.getItem('lastName') as string,
            userName: localStorage.getItem('userName') as string,
            email: localStorage.getItem('email') as string
        };

        return user;
    }

}
