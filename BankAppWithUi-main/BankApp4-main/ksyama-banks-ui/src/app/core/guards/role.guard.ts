import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      const requiredRoles = route.data['roles'] as string[];

      if (requiredRoles && requiredRoles.length > 0) {
        const hasRole = requiredRoles.some((role) => this.authService.hasRole(role));

        if (hasRole) {
          return true;
        }

        void this.router.navigate(['/unauthorized']);
        return false;
      }

      return true;
    }

    void this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
