import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification-service';
import { inject } from '@angular/core';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {

    const notificationService = inject(NotificationService)

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            handleErrors(error, notificationService)

            return throwError(() => error)
        })
    );
};

function handleErrors(error: HttpErrorResponse, notificationService: NotificationService) {
    let errorMessage: string = "";
    let notificationDuration: number = 5000;

    switch(error.status) {
        case 400: {
            errorMessage = "Invalid input. One or more validation errors occurred";
            break;
        }
        case 401: {
            let errorCode = error.error.errorCode;

            if(errorCode === "Auth.LoginFailed") {
                notificationService.showError("Invalid email address or password.");
                errorMessage = "Invalid email address or password."
                return;
            }
            notificationService.showInfo("Your session has expired or is no longer valid. Please sign in again");
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

function getAuthError(errorCode: string): string {

    switch(errorCode) {
        case "Auth.LoginFailed":
        return "Invalid email address or password.";
        default:
        return "Unexpected error happened during authentication. Try again later.";
    }

}
