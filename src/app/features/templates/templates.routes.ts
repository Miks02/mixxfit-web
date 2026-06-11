import { Routes } from '@angular/router';

export const templatesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('@features/templates/layouts/template-modal-layout/template-modal-layout')
            .then(c => c.TemplateModalLayout),
        children: [
            {
                path: '',
                loadComponent: () => import('@features/templates/components/template-list/template-list')
                    .then(c => c.TemplateList)
            },
            {
                path: 'details/:id',
                loadComponent: () => import('@features/templates/components/template-details/template-details')
                    .then(c => c.TemplateDetails)
            },
            {
                path: 'exercises',
                loadComponent: () => import('@features/templates/components/exercise-list/exercise-list')
                    .then(c => c.ExerciseList)
            },
            {
                path: 'create',
                loadComponent: () => import('@features/templates/components/template-form/template-form')
                    .then(c => c.TemplateForm),
                data: { mode: 'create' }
            },
            {
                path: 'edit/:id',
                loadComponent: () => import('@features/templates/components/template-form/template-form')
                    .then(c => c.TemplateForm),
                data: { mode: 'edit' }
            }
        ]
    }
];
