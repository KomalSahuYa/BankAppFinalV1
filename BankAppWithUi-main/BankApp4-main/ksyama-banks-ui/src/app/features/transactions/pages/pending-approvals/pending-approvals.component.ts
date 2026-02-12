import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { TransactionService } from '../../../../core/services/transaction.service';
import { TransactionResponse } from '../../../../core/models/transaction.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-pending-approvals',
  templateUrl: './pending-approvals.component.html'
})
export class PendingApprovalsComponent implements OnInit {
  pending: TransactionResponse[] = [];
  loading = false;
  errorMessage = '';
  actionInProgressId: number | null = null;

  constructor(
    private readonly transactionService: TransactionService,
    private readonly apiErrorService: ApiErrorService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  approve(id: number): void {
    if (this.actionInProgressId !== null) {
      return;
    }

    if (!window.confirm(`Approve withdrawal request #${id}?`)) {
      return;
    }

    this.actionInProgressId = id;
    this.transactionService.approve(id).subscribe({
      next: () => {
        this.pending = this.pending.filter((txn) => txn.id !== id);
        this.notificationService.show(`Withdrawal request #${id} approved.`, 'success');
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      },
      complete: () => {
        this.actionInProgressId = null;
      }
    });
  }

  reject(id: number): void {
    if (this.actionInProgressId !== null) {
      return;
    }

    if (!window.confirm(`Reject withdrawal request #${id}?`)) {
      return;
    }

    this.actionInProgressId = id;
    this.transactionService.reject(id).subscribe({
      next: () => {
        this.pending = this.pending.filter((txn) => txn.id !== id);
        this.notificationService.show(`Withdrawal request #${id} rejected.`, 'info');
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      },
      complete: () => {
        this.actionInProgressId = null;
      }
    });
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';

    this.transactionService.getPendingApprovals().subscribe({
      next: (rows) => {
        this.pending = rows;
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
