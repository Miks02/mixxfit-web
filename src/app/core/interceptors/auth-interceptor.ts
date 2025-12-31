import { HttpErrorResponse, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService)
    let router = inject(Router)
    let token = authService.accessToken;


    if(token) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(cloned).pipe(
            tap(event => {
                if(event.type === HttpEventType.Response) {
                    console.log("Returned a response with status: ", event.status);
                }
            }),
            catchError((error: HttpErrorResponse) => {
                console.log("Error happened ", error.status)
                if(error.status == 401) {
                    authService.accessToken = null;
                    console.log(authService.accessToken);
                    router.navigate(['/login'])

                }
                return throwError(() => error);

            })
        );
    }

    return next(req);
};
