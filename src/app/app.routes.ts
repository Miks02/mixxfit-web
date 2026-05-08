import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { AuthLayout } from './features/auth/auth-layout/auth-layout';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { Dashboard } from './features/dashboard/pages/dashboard-page/dashboard-page';
import { CreateExerciseForm } from './features/exercise/components/create-exercise-form/create-exercise-form';
import { EditExerciseForm } from './features/exercise/components/edit-exercise-form/edit-exercise-form';
import { ExerciseList } from './features/exercise/components/exercise-list/exercise-list';
import { ExerciseSession } from './features/exercise/components/exercise-session/exercise-session';
import { ExerciseModalLayout } from './features/exercise/layouts/exercise-modal-layout/exercise-modal-layout';
import { ProfilePage } from './features/profile/pages/profile-page/profile-page';
import { ExerciseList as TemplateExerciseList } from './features/templates/components/exercise-list/exercise-list';
import { TemplateDetails } from './features/templates/components/template-details/template-details';
import { TemplateList } from './features/templates/components/template-list/template-list';
import { TemplateModalLayout } from './features/templates/layouts/template-modal-layout/template-modal-layout';
import { WeightPage } from './features/weight/pages/weight-page/weight-page';
import { WorkoutDetails } from './features/workout/pages/workout-details/workout-details';
import { WorkoutForm } from './features/workout/pages/workout-form/workout-form';
import { WorkoutList } from './features/workout/pages/workout-list/workout-list';
import { AppLayout } from './layout/app-layout/app-layout';
import { TemplateForm } from './features/templates/components/template-form/template-form';

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
                            },
                            {
                                path: "exercises",
                                component: TemplateExerciseList
                            },
                            {
                                path: "create",
                                component: TemplateForm
                            },
                            {
                                path: "edit/:id",
                                component: TemplateForm
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
