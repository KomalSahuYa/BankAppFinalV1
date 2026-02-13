import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { TransactionService } from '../../../../core/services/transaction.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { AccountService } from '../../../../core/services/account.service';
import { AccountResponse } from '../../../../core/models/account.model';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html'
})
export class ManagerDashboardComponent implements OnInit {
  pendingCount = 0;
  todayTransactionCount = 0;
  accounts: AccountResponse[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService,
    private readonly apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loadOverview();
  }

  get accountNumbersDisplay(): string {
    return this.accounts.map((account) => account.accountNumber).join(', ');
  }

  loadOverview(): void {
    this.loading = true;
    this.errorMessage = '';
    forkJoin({
      pending: this.transactionService.getPendingApprovals(),
      accounts: this.accountService.getAccounts(),
      transactions: this.transactionService.getTodayTransactions()
    }).subscribe({
      next: ({ pending, accounts, transactions }) => {
        this.pendingCount = pending.length;
        this.accounts = accounts;
        this.todayTransactionCount = transactions.length;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
