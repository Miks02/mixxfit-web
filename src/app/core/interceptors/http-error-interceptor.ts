import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification-service';
import { inject } from '@angular/core';
import { ProblemDetails } from '../models/problem-details';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {

    const notificationService = inject(NotificationService)

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const problemDetails: ProblemDetails = error.error;
            handleErrors(problemDetails, notificationService)
            return throwError(() => problemDetails)
        })
    );
};

function handleErrors(error: ProblemDetails, notificationService: NotificationService) {
    let errorMessage: string = "";
    let notificationDuration: number = 5000;

    switch(error.status) {
        case 400: {
            errorMessage = "Invalid input. One or more validation errors occurred";
            break;
        }
        case 401: {
            let errorCode = error.errorCode;

            if(errorCode === "Auth.LoginFailed") {
                notificationService.showError("Invalid email address or password.");
                return;
            }
            if (errorCode !== "Auth.ExpiredToken")
                notificationService.showError("An unexpected error occured during the authentication.")

            return;
        }
        case 403: {
            errorMessage = "Forbidden access.";
            break;
        }
        case 404: {
            errorMessage = "Resource not found.";
            break;
        }
        case 409: {
            errorMessage = "Duplicate Entry. Please check your input and try again."
            break;
        }
        case 429: {
            errorMessage = "Too many requests, try again later"
            break;
        }
        case 499: {
            errorMessage = "Request has been cancelled"
            notificationService.showInfo(errorMessage);
            return;
        }
        default: {
            errorMessage = "An unexpected server error occurred. Please try again later."
            notificationDuration = Infinity;
        }
    }

    notificationService.showError(errorMessage, notificationDuration)
}
