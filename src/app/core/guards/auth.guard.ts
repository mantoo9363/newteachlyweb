import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PopupService } from '../services/popup.service';

export const authGuard: CanActivateFn = () => {
  if (sessionStorage.getItem('access_token')) {
    return true;
  }

  const router = inject(Router);
  const popupService = inject(PopupService);

  popupService.openSignup();
  return router.parseUrl('/');
};
