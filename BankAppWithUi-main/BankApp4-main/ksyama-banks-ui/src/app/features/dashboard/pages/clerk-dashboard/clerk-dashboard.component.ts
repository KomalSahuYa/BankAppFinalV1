import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { AccountService } from '../../../../core/services/account.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-clerk-dashboard',
  templateUrl: './clerk-dashboard.component.html'
})
export class ClerkDashboardComponent implements OnInit {
  loading = false;
  errorMessage = '';
  totalAccounts = 0;
  totalBalance = 0;

  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
    private readonly apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.errorMessage = '';

    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.totalAccounts = accounts.length;
        this.totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  get clerkName(): string {
    return this.authService.getUsername() || 'Clerk';
  }
}
