import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const allowedRoles = route.data['roles'] as Array<'CLERK' | 'MANAGER'> | undefined;

    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/login']);
    }

    if (!allowedRoles || allowedRoles.some((role) => this.authService.hasRole(role))) {
      return true;
    }

    this.notificationService.show('You are not authorized to access that page.', 'warning');
    return this.router.createUrlTree(['/dashboard']);
  }
}
