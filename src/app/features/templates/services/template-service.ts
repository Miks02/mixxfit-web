import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TemplateDto } from '../models/template-dto';
import { TemplateRequest } from '../models/template-request';

@Injectable({
    providedIn: 'root',
})
export class TemplateService {
    private api = environment.apiUrl;

    private _templates: WritableSignal<TemplateDto[] | undefined> = signal(undefined);
    templates = this._templates.asReadonly();

    private http = inject(HttpClient);

    getTemplates(): Observable<TemplateDto[]> {
        if(this.templates())
            return of(this.templates()!)

        return this.http.get<TemplateDto[]>(`${this.api}/workout-templates`).pipe(
            tap((res) => this._templates.set(res))
        );
    }

    getTemplateById(id: number): Observable<TemplateDto> {
        return this.http.get<TemplateDto>(`${this.api}/workout-templates/${id}`)
    }

    addTemplate(request: TemplateRequest) {
        return this.http.post<TemplateDto>(`${this.api}/workout-templates/`, request);
    }

}
