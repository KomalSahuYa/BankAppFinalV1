import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PermissionService } from '../../../core/services/permission.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {
  isLoggingOut = false;

  constructor(
    public readonly authService: AuthService,
    public readonly permissionService: PermissionService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {}

  logout(): void {
    if (this.isLoggingOut) {
      return;
    }

    const confirmed = window.confirm('Are you sure you want to log out of the banking console?');
    if (!confirmed) {
      return;
    }

    this.isLoggingOut = true;
    this.authService.logout();
    this.notificationService.show('You have logged out successfully.', 'info');
    void this.router.navigate(['/login']).finally(() => {
      this.isLoggingOut = false;
    });
  }
}
