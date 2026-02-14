import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  isLoggingOut = false;
  showLogoutDialog = false;
  readonly themes = [
    { value: 'default', label: 'Default' },
    { value: 'dark', label: 'Dark' },
    { value: 'violet', label: 'Violet' }
  ] as const;
  selectedTheme: 'default' | 'dark' | 'violet' = 'default';

  constructor(
    public readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const savedTheme = (localStorage.getItem('appTheme') as 'default' | 'dark' | 'violet' | null) ?? 'default';
    this.changeTheme(savedTheme);
  }

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

  changeTheme(theme: 'default' | 'dark' | 'violet'): void {
    this.selectedTheme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('appTheme', theme);
  }
}
