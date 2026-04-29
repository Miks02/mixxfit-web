import { Routes } from '@angular/router';
import { AuthLayout } from './features/auth/auth-layout/auth-layout';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { Dashboard } from './features/dashboard/pages/dashboard-page/dashboard-page';
import { AppLayout } from './layout/app-layout/app-layout';
import { WorkoutList } from './features/workout/pages/workout-list/workout-list';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { WorkoutForm } from './features/workout/pages/workout-form/workout-form';
import { ProfilePage } from './features/profile/pages/profile-page/profile-page';
import { WorkoutDetails } from './features/workout/pages/workout-details/workout-details';
import { WeightPage } from './features/weight/pages/weight-page/weight-page';
import { ExerciseList } from './features/exercise/components/exercise-list/exercise-list';
import { ExerciseModalLayout } from './features/exercise/layouts/exercise-modal-layout/exercise-modal-layout';
import { CreateExerciseForm } from './features/exercise/components/create-exercise-form/create-exercise-form';
import { EditExerciseForm } from './features/exercise/components/edit-exercise-form/edit-exercise-form';
import { ExerciseSession } from './features/exercise/components/exercise-session/exercise-session';
import { Component } from '@angular/core';
import { TemplateModalLayout } from './features/templates/layouts/template-modal-layout/template-modal-layout';
import { TemplateList } from './features/templates/components/template-list/template-list';
import { TemplateDetails } from './features/templates/components/template-details/template-details';

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
                component: WorkoutForm,
                children: [
                    {
                        path: "exercises",
                        component: ExerciseModalLayout,
                        children: [
                            {
                                path: "",
                                component: ExerciseList
                            },
                            {
                                path: "create",
                                component: CreateExerciseForm
                            },
                            {
                                path: "edit/:id",
                                component: EditExerciseForm
                            },
                            {
                                path: "session",
                                component: ExerciseSession
                            }
                        ],

                    },
                    {
                        path: "templates",
                        component: TemplateModalLayout,
                        children: [
                            {
                                path: "",
                                component: TemplateList
                            },
                            {
                                path: "details/:id",
                                component: TemplateDetails
                            }
                        ]
                    }

                ]
            },
            {
                path: "weight",
                component: WeightPage
            },
            {
                path: "profile",
                component: ProfilePage
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
