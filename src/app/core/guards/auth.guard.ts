import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PopupService } from '../services/popup.service';
import { AuthStorageService } from '../services/auth-storage.service';

export const authGuard: CanActivateFn = () => {
  const authStorage = inject(AuthStorageService);

  if (authStorage.isLoggedIn()) {
    return true;
  }

  const router = inject(Router);
  const popupService = inject(PopupService);

  popupService.openSignup();
  return router.parseUrl('/');
};
