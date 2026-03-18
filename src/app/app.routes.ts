import { Routes } from '@angular/router';
import { AuthLayout } from './features/auth/auth-layout/auth-layout';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { AppLayout } from './layout/app-layout/app-layout';
import { WorkoutList } from './features/workout/pages/workout-list/workout-list';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { WorkoutForm } from './features/workout/pages/workout-form/workout-form';
import { ProfilePage } from './features/profile/pages/profile-page/profile-page';
import { WorkoutDetails } from './features/workout/pages/workout-details/workout-details';
import { WeightPage } from './features/weight/pages/weight-page/weight-page';
import { ExerciseForm } from './features/exercise/components/exercise-form/exercise-form';

export const routes: Routes = [
    {
        path: "",
        canActivate: [authGuard],
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
            },
            {
                path: "workouts/:id",
                component: WorkoutDetails
            },
            {
                path: "workout-form",
                component: WorkoutForm
            },
            {
                path: "weight",
                component: WeightPage
            },
            {
                path: "profile",
                component: ProfilePage
            },
            {
                path: "exercise-form",
                component: ExerciseForm
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
