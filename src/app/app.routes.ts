import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { AuthLayout } from './features/auth/auth-layout/auth-layout';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { AppLayout } from './layout/app-layout/app-layout';

export const routes: Routes = [
    {
        path: "",
        canActivate: [authGuard],
        component: AppLayout,
        children: [
            {
                path: "",
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('@features/dashboard/pages/dashboard-page/dashboard-page')
                    .then(c => c.Dashboard),
            },
            {
                path: "workouts",
                loadChildren: () => import('@features/workout/workout.routes')
                    .then(ch => ch.workoutRoutes)
            },
            {
                path: "weight",
                loadComponent: () => import('@features/weight/pages/weight-page/weight-page')
                    .then(c => c.WeightPage),
            },
            {
                path: "profile",
                loadComponent: () => import('@features/profile/pages/profile-page/profile-page')
                    .then(c => c.ProfilePage)
            }
        ]
    },
    {
        path: "",
        canActivate: [guestGuard],
        component: AuthLayout,
        children: [
            {
                path: "",
                redirectTo: "login",
                pathMatch: "full"
            },
            {
                path: "login",
                component: Login
            },
            {
                path: "register",
                component: Register
            }
        ]
    }
];
