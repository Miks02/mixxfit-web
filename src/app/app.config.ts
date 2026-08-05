import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { httpErrorInterceptor } from './core/interceptors/http-error-interceptor';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';

export const appConfig: ApplicationConfig = {
    providers: [
        provideTanStackQuery(new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000,
                    retry: 1
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
