import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TemplateDto } from '../models/template-dto';
import { TemplateRequest } from '../models/template-request';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { ProblemDetails } from '../../../core/models/problem-details';

@Injectable({
    providedIn: 'root',
})
export class TemplateService {
    private api = environment.apiUrl;

    private http = inject(HttpClient);
    private queryClient = inject(QueryClient);

    getTemplatesQuery = injectQuery(() => ({
        queryKey: ['templates'],
        queryFn: async () => await lastValueFrom(this.getTemplates()),
        staleTime: Infinity,
    }));

    getTemplateByIdQuery(id: number) {
        return injectQuery<TemplateDto, ProblemDetails>(() => ({
            queryKey: ['template', id],
            queryFn: async () => await lastValueFrom(this.getTemplateById(id)),
            staleTime: Infinity,
        }));
    }

    createTemplateMutation = injectMutation<TemplateDto, ProblemDetails, TemplateRequest>(() => ({
        mutationFn: async (request: TemplateRequest) => await lastValueFrom(this.addTemplate(request)),
        onSuccess: (res) => {
            this.queryClient.setQueryData<TemplateDto[]>(['templates'], prev => [...(prev ?? []), res]);
            this.queryClient.setQueryData(['template', res.id], res);
        }
    }));

    updateTemplateMutation = injectMutation<TemplateDto, ProblemDetails, TemplateRequest>(() => ({
        mutationFn: async (request: TemplateRequest) => await lastValueFrom(this.updateTemplate(request)),
        onSuccess: (res) => {
            this.queryClient.setQueryData<TemplateDto[]>(['templates'], prev => prev?.map(t => t.id === res.id ? res : t) ?? [res]);
            this.queryClient.setQueryData(['template', res.id], res);
        }
    }));

    deleteTemplateMutation = injectMutation<void, ProblemDetails, number>(() => ({
        mutationFn: async (id: number) => await lastValueFrom(this.deleteTemplate(id)),
        onSuccess: (_res, id) => {
            this.queryClient.setQueryData<TemplateDto[]>(['templates'], prev => prev?.filter(t => t.id !== id) ?? []);
            this.queryClient.removeQueries({queryKey: ['template', id]});
        }
    }));

    private getTemplates(): Observable<TemplateDto[]> {
        return this.http.get<TemplateDto[]>(`${this.api}/workout-templates`)
    }

    private getTemplateById(id: number): Observable<TemplateDto> {
        return this.http.get<TemplateDto>(`${this.api}/workout-templates/${id}`)
    }

    private addTemplate(request: TemplateRequest) {
        return this.http.post<TemplateDto>(`${this.api}/workout-templates/`, request)
    }

    private updateTemplate(request: TemplateRequest) {
        return this.http.put<TemplateDto>(`${this.api}/workout-templates/`, request)
    }

    private deleteTemplate(id: number) {
        return this.http.delete<void>(`${this.api}/workout-templates/${id}`)
    }

}
