import { Component } from '@angular/core';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-home',
  template: `
    <app-manager-dashboard *ngIf="authService.hasRole('MANAGER')"></app-manager-dashboard>
    <app-clerk-dashboard *ngIf="authService.hasRole('CLERK') && !authService.hasRole('MANAGER')"></app-clerk-dashboard>
  `
})
export class DashboardHomeComponent {
  constructor(public readonly authService: AuthService) {}
}
