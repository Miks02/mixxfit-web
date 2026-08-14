import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { httpErrorInterceptor } from './core/interceptors/http-error-interceptor';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { ProblemDetails } from './core/models/problem-details';


export const appConfig: ApplicationConfig = {
    providers: [
        provideTanStackQuery(new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: Infinity,
                    gcTime: 15 * 60 * 1000,
                    retry: (failureCount, error: any) => {
                        const errorStatus = error.status;
                        if(errorStatus >= 400 && errorStatus < 500)
                            return false;
                        return failureCount < 3;
                    }
                }
            }
        })),
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideHttpClient(withInterceptors([
            httpErrorInterceptor, authInterceptor
        ])),
        provideCharts(withDefaultRegisterables())
    ]
};
