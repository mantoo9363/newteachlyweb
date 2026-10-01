import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const homeQueryGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const allowedParams: string[] = [];

  const queryParams = Object.keys(route.queryParams);

  const hasInvalidQuery = queryParams.some(
    param => !allowedParams.includes(param)
  );

  if (hasInvalidQuery) {
    return router.createUrlTree(['/404']);
  }

  return true;
};