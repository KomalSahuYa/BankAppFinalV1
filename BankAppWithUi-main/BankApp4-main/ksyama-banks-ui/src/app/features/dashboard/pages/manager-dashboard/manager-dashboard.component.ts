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
  activeClerkCount = 0;
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

  loadOverview(): void {
    this.loading = true;
    this.errorMessage = '';
    forkJoin({
      pending: this.transactionService.getPendingApprovals(),
      accounts: this.accountService.getAccounts(),
      employees: this.accountService.getEmployees(),
      transactions: this.transactionService.getTodayTransactions()
    }).subscribe({
      next: ({ pending, accounts, employees, transactions }) => {
        this.pendingCount = pending.length;
        this.accounts = accounts;
        this.activeClerkCount = employees.filter((employee) => employee.role === 'CLERK').length;
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
