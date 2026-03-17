import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { catchError, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

let isRedirectingToLogin = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const location = inject(Location);
  const authService = inject(AuthService);

  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const apiReq = req.clone({ withCredentials: true });

  const isAuthEndpoint = ['/login', '/logout', '/register', '/activate']
    .some(path => req.url.includes(path));

  return next(apiReq).pipe(
    catchError((err) => {
      if (err.status !== 401 || isAuthEndpoint) {
        return throwError(() => err);
      }

      if (!isRedirectingToLogin && authService.isAuthenticated()) {
        isRedirectingToLogin = true;
        const returnUrl = location.path();

        authService.logoutAndRedirect('/auth/login', {
          sessionExpired: 'true',
          message: 'Session expiree. Veuillez vous reconnecter.',
          ...(returnUrl && returnUrl !== '/auth/login' ? { returnUrl } : {}),
        });

        router.events.pipe(take(1)).subscribe(() => {
          isRedirectingToLogin = false;
        });
      }

      return throwError(() => err);
    }),
  );
};
