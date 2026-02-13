import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

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
  errorMessage = '';
  editingAccountNumber: string | null = null;
  editHolderName = '';

  constructor(
    private readonly accountService: AccountService,
    private readonly apiErrorService: ApiErrorService,
    private readonly notificationService: NotificationService,
    public readonly permissionService: PermissionService
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

  startEdit(account: AccountResponse): void {
    this.editingAccountNumber = account.accountNumber;
    this.editHolderName = account.holderName;
  }

  cancelEdit(): void {
    this.editingAccountNumber = null;
    this.editHolderName = '';
  }

  saveEdit(accountNumber: string): void {
    const trimmedName = this.editHolderName.trim();
    if (!trimmedName) {
      this.notificationService.show('Holder name cannot be blank.', 'warning');
      return;
    }

    this.accountService.updateAccount(accountNumber, { holderName: trimmedName }).subscribe({
      next: () => {
        this.notificationService.show('Account updated successfully.', 'success');
        this.cancelEdit();
        this.loadAccounts();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      }
    });
  }

  deleteAccount(account: AccountResponse): void {
    const confirmed = window.confirm(`Delete account ${account.accountNumber} for ${account.holderName}?`);
    if (!confirmed) {
      return;
    }

    this.accountService.deleteAccount(account.accountNumber).subscribe({
      next: () => {
        this.notificationService.show('Account deleted successfully.', 'success');
        this.loadAccounts();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      }
    });
  }
}
