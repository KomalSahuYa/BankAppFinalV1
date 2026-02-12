import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { ApiErrorService } from '../services/api-error.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const apiErrorService = inject(ApiErrorService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        notificationService.show('Unable to reach the banking server. Please retry in a moment.', 'danger');
      }

      if (error.status === 401) {
        authService.logout();

        if (router.url !== '/login') {
          notificationService.show('Your session is no longer valid. Please sign in again.', 'warning');
          void router.navigate(['/login']);
        }
      } else if (error.status === 403) {
        notificationService.show('You are not authorized to perform this action.', 'warning');
      } else if (error.status >= 500) {
        notificationService.show(apiErrorService.getMessage(error), 'danger');
      }

      return throwError(() => error);
    })
  );
};
