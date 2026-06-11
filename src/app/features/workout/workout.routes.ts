import { Routes } from '@angular/router';

export const workoutRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/workout-list/workout-list')
            .then(c => c.WorkoutList)
    },
    {
        path: 'details/:id',
        loadComponent: () => import('./pages/workout-details/workout-details')
            .then(c => c.WorkoutDetails)
    },
    {
        path: 'create',
        loadComponent: () => import('./pages/workout-form/workout-form')
            .then(c => c.WorkoutForm),
        children: [
            {
                path: 'exercises',
                loadChildren: () => import('@features/exercise/exercise.routes')
                    .then(r => r.exerciseRoutes)
            },
            {
                path: 'templates',
                loadChildren: () => import('@features/templates/templates.routes')
                    .then(r => r.templatesRoutes)
            }
        ]
    }
];
