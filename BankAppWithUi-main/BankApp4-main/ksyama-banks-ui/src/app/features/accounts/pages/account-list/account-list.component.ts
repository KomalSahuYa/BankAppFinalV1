import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

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
  lookupResult: AccountResponse | null = null;
  showAccounts = false;
  sortOrder: 'asc' | 'desc' = 'desc';
  accountToDelete: AccountResponse | null = null;
  deleteConfirmStep: 1 | 2 = 1;
  page = 1;
  readonly pageSize = 8;

  readonly lookupForm = this.fb.nonNullable.group({
    lookupValue: ['', [Validators.required]],
    lookupType: this.fb.nonNullable.control<'accountNumber' | 'holderName'>('accountNumber')
  });

  constructor(
    private readonly accountService: AccountService,
    private readonly apiErrorService: ApiErrorService,
    private readonly notificationService: NotificationService,
    public readonly permissionService: PermissionService,
    private readonly router: Router,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (!this.permissionService.canViewAllAccounts()) {
      return;
    }

    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.accountService.getAccounts().pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (accounts) => {
        this.accounts = [...accounts].sort((a, b) => this.sortOrder === 'asc' ? a.id - b.id : b.id - a.id);
        this.page = 1;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      }
    });
  }

  toggleAccountsVisibility(): void {
    this.showAccounts = !this.showAccounts;
  }

  applySortOrder(order: 'asc' | 'desc'): void {
    this.sortOrder = order;
    this.accounts = [...this.accounts].sort((a, b) => this.sortOrder === 'asc' ? a.id - b.id : b.id - a.id);
    this.page = 1;
  }

  get pagedAccounts(): AccountResponse[] {
    const start = (this.page - 1) * this.pageSize;
    return this.accounts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.accounts.length / this.pageSize));
  }

  nextPage(): void { this.page = Math.min(this.totalPages, this.page + 1); }
  prevPage(): void { this.page = Math.max(1, this.page - 1); }

  lookupByAccountNumber(): void {
    if (this.lookupForm.invalid) {
      return;
    }
    const lookupValue = this.lookupForm.controls.lookupValue.value.trim();
    this.lookupResult = null;
    this.errorMessage = '';

    if (this.lookupForm.controls.lookupType.value === 'holderName') {
      const match = this.accounts.find((account) => account.holderName.toLowerCase() === lookupValue.toLowerCase());
      if (!match) {
        this.errorMessage = 'No account found for the provided account holder name.';
        return;
      }
      this.lookupResult = match;
      return;
    }

    this.accountService.getAccountByNumber(lookupValue).subscribe({
      next: (account) => {
        this.lookupResult = account;
      },
      error: (error: HttpErrorResponse) => {
        this.lookupResult = null;
        this.errorMessage = this.apiErrorService.getMessage(error);
      }
    });
  }

  openEditPage(accountNumber: string): void {
    void this.router.navigate(['/accounts/update', accountNumber]);
  }

  requestDelete(account: AccountResponse): void {
    if (!this.actionInProgress) {
      this.accountToDelete = account;
      this.deleteConfirmStep = 1;
    }
  }

  cancelDelete(): void {
    this.accountToDelete = null;
    this.deleteConfirmStep = 1;
  }

  proceedDeleteStepTwo(): void {
    this.deleteConfirmStep = 2;
  }

  deleteAccount(): void {
    if (this.actionInProgress) {
      return;
    }

    if (!this.accountToDelete || this.deleteConfirmStep !== 2) {
      return;
    }

    const accountNumber = this.accountToDelete.accountNumber;
    this.accountToDelete = null;
    this.deleteConfirmStep = 1;

    this.actionInProgress = true;
    this.errorMessage = '';

    this.accountService.deleteAccount(accountNumber).pipe(finalize(() => {
      this.actionInProgress = false;
    })).subscribe({
      next: () => {
        this.notificationService.show(`Account ${accountNumber} deleted successfully.`, 'success');
        this.loadAccounts();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      }
    });
  }
}
