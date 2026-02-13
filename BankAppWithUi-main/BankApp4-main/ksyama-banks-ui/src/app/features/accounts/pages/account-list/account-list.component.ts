import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { AccountService } from '../../../../core/services/account.service';
import { AccountResponse } from '../../../../core/models/account.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html'
})
export class AccountListComponent implements OnInit {
  accounts: AccountResponse[] = [];
  loading = false;
  actionInProgress = false;
  errorMessage = '';

  constructor(
    private readonly accountService: AccountService,
    private readonly apiErrorService: ApiErrorService,
    private readonly notificationService: NotificationService,
    public readonly permissionService: PermissionService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (this.permissionService.canViewAllAccounts()) {
      this.loadAccounts();
    }
  }

  loadAccounts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  openEditPage(accountNumber: string): void {
    void this.router.navigate(['/accounts/update', accountNumber]);
  }

  deleteAccount(accountNumber: string): void {
    if (this.actionInProgress) {
      return;
    }

    const confirmed = window.confirm(`Delete account ${accountNumber}? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    this.actionInProgress = true;
    this.errorMessage = '';

    this.accountService.deleteAccount(accountNumber).subscribe({
      next: () => {
        this.notificationService.show(`Account ${accountNumber} deleted successfully.`, 'success');
        this.loadAccounts();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      },
      complete: () => {
        this.actionInProgress = false;
      }
    });
  }
}
