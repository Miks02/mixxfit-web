import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TemplateDto } from '../models/template-dto';
import { TemplateRequest } from '../models/template-request';
import { NotificationService } from '../../../core/services/notification-service';

@Injectable({
    providedIn: 'root',
})
export class TemplateService {
    private api = environment.apiUrl;

    private _templates: WritableSignal<TemplateDto[] | undefined> = signal(undefined);
    templates = this._templates.asReadonly();

    private http = inject(HttpClient);
    private notification = inject(NotificationService);

    getTemplates(): Observable<TemplateDto[]> {
        if(this.templates())
            return of(this.templates()!)

        return this.http.get<TemplateDto[]>(`${this.api}/workout-templates`).pipe(
            tap((res) => this._templates.set(res))
        );
    }

    getTemplateById(id: number): Observable<TemplateDto> {
        return this.http.get<TemplateDto>(`${this.api}/workout-templates/${id}`).pipe(
            catchError((err: HttpErrorResponse) => {
                if(err.error.errorCode === "WorkoutTemplate.NotFound")
                    this.notification.showError("Requested template has not been found")
                return throwError(() => err)
            })
        )
    }

    addTemplate(request: TemplateRequest) {
        return this.http.post<TemplateDto>(`${this.api}/workout-templates/`, request).pipe(
            tap((res) => {
                this._templates.update(prev => [...prev ?? [], res]);
                this.notification.showSuccess('Template created successfully!');
            }),
            catchError((err: HttpErrorResponse) => {
                let errorCode = err.error.errorCode;

                switch(errorCode) {
                    case "WorkoutTemplate.AlreadyExists":
                    this.notification.showError("Requested tempate was not found")
                    break;
                    case "WorkoutTemplate.LimitReached":
                    this.notification.showError("You reached the limit for adding templates")
                    break;
                    case "Exercise.NotFound":
                    this.notification.showError("Some of the requested exercises are not found in the system")
                    break;
                    default:
                    this.notification.showError("An error occurred while creating a new template. Try again later");
                }

                return throwError(() => err)
            })
        );
    }

    updateTemplate(request: TemplateRequest) {
        return this.http.put<TemplateDto>(`${this.api}/workout-templates/`, request).pipe(
            tap((res) => {
                this._templates.update(prev => [...prev?.filter(t => t.id !== request.id) ?? [], res]);
                this.notification.showSuccess('Template updated successfully!');
            }),
            catchError((err: HttpErrorResponse) => {
                let errorCode = err.error.errorCode;

                switch(errorCode) {
                    case "WorkoutTemplate.AlreadyExists":
                    this.notification.showError("Requested tempate was not found")
                    break;
                    case "WorkoutTemplate.NotFound":
                    this.notification.showError("Template that you tried to update was not found")
                    break;
                    case "Exercise.NotFound":
                    this.notification.showError("Some of the requested exercises are not found in the system")
                    break;
                    default:
                    this.notification.showError("An error occurred while trying to update your template. Try again later");
                }

                return throwError(() => err)
            })
        )
    }

    deleteTemplate(id: number) {
        return this.http.delete<void>(`${this.api}/workout-templates/${id}`).pipe(
            tap(() => {
                this._templates.update(prev => [...prev?.filter(t => t.id !== id) ?? []]);
                this.notification.showSuccess('Template deleted successfully!');
            }),
            catchError((err: HttpErrorResponse) => {
                let errorCode = err.error.errorCode;

                if(errorCode === "WorkoutTemplate.NotFound")
                    this.notification.showError("Template that you tried to update was not found")
                else
                    this.notification.showError("An error occurred while trying to delete your template. Try again later")

                return throwError(() => err)
            })
        )
    }

}
