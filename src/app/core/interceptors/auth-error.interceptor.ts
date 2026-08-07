import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthStorageService } from '../services/auth-storage.service';

const AI_IFRAME_LOGIN_COOKIE = 'teachly_ai_logged_in';
const AI_IFRAME_TOKEN_COOKIE = 'teachly_ai_token';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authStorage = inject(AuthStorageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && authStorage.isLoggedIn()) {
        authStorage.clearAuth();
        localStorage.removeItem('teachly_signup_draft');
        clearAiIframeLoginCookie();

        if (window.location.pathname !== '/') {
          window.location.href = '/';
        } else {
          window.location.reload();
        }
      }

      return throwError(() => error);
    })
  );
};

function clearAiIframeLoginCookie(): void {
  document.cookie = `${AI_IFRAME_LOGIN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${AI_IFRAME_LOGIN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `${AI_IFRAME_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${AI_IFRAME_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
