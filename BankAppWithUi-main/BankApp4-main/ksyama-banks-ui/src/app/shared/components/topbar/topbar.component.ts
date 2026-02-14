import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  isLoggingOut = false;
  showLogoutDialog = false;

  constructor(
    public readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {}

  openLogoutDialog(): void {
    if (!this.isLoggingOut) {
      this.showLogoutDialog = true;
    }
  }

  closeLogoutDialog(): void {
    this.showLogoutDialog = false;
  }

  logout(): void {
    if (this.isLoggingOut) {
      return;
    }

    this.showLogoutDialog = false;
    this.isLoggingOut = true;
    this.authService.logout();
    this.notificationService.show('You have logged out successfully.', 'info');
    void this.router.navigate(['/login']).finally(() => {
      this.isLoggingOut = false;
    });
  }
}
