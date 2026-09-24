import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const resetPasswordGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const hasParams = !!route.queryParamMap.get('token') && !!route.queryParamMap.get('userId');

    return hasParams ? true : router.createUrlTree(['/forgot-password']);
};
