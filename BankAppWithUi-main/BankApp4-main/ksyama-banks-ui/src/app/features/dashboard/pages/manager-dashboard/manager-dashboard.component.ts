import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TransactionService } from '../../../../core/services/transaction.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { AccountService } from '../../../../core/services/account.service';
import { AccountResponse } from '../../../../core/models/account.model';
import { TransactionResponse } from '../../../../core/models/transaction.model';

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
  dayCount = 0;
  monthCount = 0;
  yearCount = 0;
  auditLogs: string[] = [];

  constructor(
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService,
    private readonly apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loadOverview();
  }

  loadLogs(): void {
    this.accountService.getAuditLogs().subscribe({
      next: (logs) => {
        this.auditLogs = logs.slice().reverse().slice(0, 100);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      }
    });
  }

  get maxGraphCount(): number {
    return Math.max(this.dayCount, this.monthCount, this.yearCount, 1);
  }

  loadOverview(): void {
    this.loading = true;
    this.errorMessage = '';
    forkJoin({
      pending: this.transactionService.getPendingApprovals(),
      accounts: this.accountService.getAccounts(),
      employees: this.accountService.getEmployees(),
      recentTransactions: this.transactionService.getRecentTransactions(500)
    }).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: ({ pending, accounts, employees, recentTransactions }) => {
        this.pendingCount = pending.length;
        this.accounts = accounts;
        this.activeClerkCount = employees.filter((employee) => employee.role === 'CLERK').length;

        const approvedTransactions = recentTransactions.filter((transaction) => transaction.status === 'APPROVED');
        const metrics = this.calculateTimeMetrics(approvedTransactions);
        this.dayCount = metrics.day;
        this.monthCount = metrics.month;
        this.yearCount = metrics.year;
        this.todayTransactionCount = metrics.day;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      }
    });
  }

  private calculateTimeMetrics(transactions: TransactionResponse[]): { day: number; month: number; year: number } {
    const now = new Date();
    const todayDate = now.toDateString();
    const month = now.getMonth();
    const year = now.getFullYear();

    let day = 0;
    let monthCount = 0;
    let yearCount = 0;

    transactions.forEach((transaction) => {
      const date = new Date(transaction.timestamp);
      if (Number.isNaN(date.getTime())) {
        return;
      }

      if (date.getFullYear() === year) {
        yearCount += 1;

        if (date.getMonth() === month) {
          monthCount += 1;
        }
      }

      if (date.toDateString() === todayDate) {
        day += 1;
      }
    });

    return { day, month: monthCount, year: yearCount };
  }
}
