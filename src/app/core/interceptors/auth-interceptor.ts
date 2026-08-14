import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, tap, throwError } from 'rxjs';
import { NotificationService } from '../services/notification-service';

let isRefreshing: boolean = false;
const accessTokenSubject = new BehaviorSubject<string | null>(null);
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const notificationService = inject(NotificationService);
    let token = authService.accessToken();

    if(!token) {
        return next(req);
    }

    return next(addTokenHeader(req, token)).pipe(
        catchError((error: HttpErrorResponse) => {
            if(error.status === 401) {
                return handle401Error(req, next, notificationService, authService);
            }
            return throwError(() => error);
        })
    );
};

function handle401Error(
    req: HttpRequest<any>,
    next: HttpHandlerFn,
    notificationService: NotificationService,
    authService: AuthService): Observable<HttpEvent<any>> {
        if(!isRefreshing) {
            isRefreshing = true;
            authService.setAccessToken(null);
            accessTokenSubject.next(null);
            return authService.rotateAuthTokens().pipe(
                switchMap((res): Observable<HttpEvent<any>> => {
                    isRefreshing = false;
                    const newToken = res;
                    authService.setAccessToken(newToken);
                    accessTokenSubject.next(newToken);
                    return next(addTokenHeader(req, newToken))
                }),
                catchError((err: HttpErrorResponse) => {
                    isRefreshing = false;
                    accessTokenSubject.next(null);
                    if(err.status == 401) {
                        window.location.href = '/login?expired=true'
                        notificationService.showInfo("Your session has expired or is no longer valid. Please sign in again");
                    }
                    return throwError(() => err)

                })
            )
        }

        return accessTokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap((token): Observable<HttpEvent<any>> => next(addTokenHeader(req, token)))
        )


    }

    function addTokenHeader(req: HttpRequest<any>, token: string) {
        return req.clone({
            setHeaders: {Authorization: `Bearer ${token}`},

        })
    }
