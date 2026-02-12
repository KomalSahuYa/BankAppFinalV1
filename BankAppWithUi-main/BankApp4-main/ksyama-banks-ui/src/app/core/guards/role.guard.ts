import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
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

    return this.router.createUrlTree(['/dashboard']);
  }
}
