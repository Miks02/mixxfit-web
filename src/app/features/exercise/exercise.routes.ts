import { Routes } from '@angular/router';

export const exerciseRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('@features/exercise/layouts/exercise-modal-layout/exercise-modal-layout')
            .then(c => c.ExerciseModalLayout),
        children: [
            {
                path: '',
                loadComponent: () => import('@features/exercise/components/exercise-list/exercise-list')
                    .then(c => c.ExerciseList)
            },
            {
                path: 'create',
                loadComponent: () => import('@features/exercise/components/create-exercise-form/create-exercise-form')
                    .then(c => c.CreateExerciseForm)
            },
            {
                path: 'edit/:id',
                loadComponent: () => import('@features/exercise/components/edit-exercise-form/edit-exercise-form')
                    .then(c => c.EditExerciseForm)
            },
            {
                path: 'session',
                loadComponent: () => import('@features/exercise/components/exercise-session/exercise-session')
                    .then(c => c.ExerciseSession)
            }
        ]
    }
];
