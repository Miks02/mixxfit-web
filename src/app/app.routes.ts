import { Routes } from '@angular/router';
import { AuthLayout } from './auth/auth-layout/auth-layout';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { AppLayout } from './layout/app-layout/app-layout';
import { WorkoutList } from './pages/workout/workout-list/workout-list';

export const routes: Routes = [
    {
        path: "",
        component: AppLayout,
        children: [
            {
                path: "",
                redirectTo: "dashboard",
                pathMatch: "full"
            },
            {
                path: "dashboard",
                component: Dashboard
            },
            {
                path: "workouts",
                component: WorkoutList
            }
        ]
    },
    {
        path: "auth",
        component: AuthLayout,
        children: [
            {
                path: "",
                component: Login
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
