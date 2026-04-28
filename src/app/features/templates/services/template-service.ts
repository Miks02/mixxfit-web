import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TemplateDto } from '../models/template-dto';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TemplateService {
    private api = environment.apiUrl;

    private _templates: WritableSignal<TemplateDto[] | undefined> = signal(undefined);
    templates = this._templates.asReadonly();

    private http = inject(HttpClient);

    getTemplates(): Observable<TemplateDto[]> {
        return this.http.get<TemplateDto[]>(`${this.api}/workout-templates`).pipe(
            tap((res) => this._templates.set(res))
        );
    }

}
