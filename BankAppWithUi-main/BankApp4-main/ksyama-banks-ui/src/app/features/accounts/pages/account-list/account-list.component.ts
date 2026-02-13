import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';

import { AccountService } from '../../../../core/services/account.service';
import { AccountResponse } from '../../../../core/models/account.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { trimmedRequiredValidator } from '../../../../core/validators/form-validators';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html'
})
export class AccountListComponent implements OnInit {
  accounts: AccountResponse[] = [];
  loading = false;
  actionInProgress = false;
  errorMessage = '';
  editingAccountNumber: string | null = null;

  readonly editForm = this.fb.nonNullable.group({
    holderName: ['', [Validators.required, trimmedRequiredValidator]]
  });

  constructor(
    private readonly fb: FormBuilder,
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
    this.editForm.reset({ holderName: account.holderName });
  }

  cancelEdit(): void {
    this.editingAccountNumber = null;
    this.editForm.reset({ holderName: '' });
  }

  saveEdit(accountNumber: string): void {
    if (this.editForm.invalid || this.actionInProgress) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.actionInProgress = true;
    this.errorMessage = '';

    this.accountService
      .updateAccount(accountNumber, { holderName: this.editForm.controls.holderName.value.trim() })
      .subscribe({
        next: () => {
          this.notificationService.show(`Account ${accountNumber} updated successfully.`, 'success');
          this.cancelEdit();
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
        this.cancelEdit();
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
