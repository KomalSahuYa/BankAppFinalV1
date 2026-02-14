import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

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
  selectedTransaction: TransactionResponse | null = null;
  pendingAction: 'approve' | 'reject' | null = null;

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

    const txn = this.pending.find((item) => item.id === id);
    if (!txn) {
      return;
    }

    this.pendingAction = 'approve';
    this.selectedTransaction = txn;
  }

  reject(id: number): void {
    if (this.actionInProgressId !== null) {
      return;
    }

    const txn = this.pending.find((item) => item.id === id);
    if (!txn) {
      return;
    }

    this.pendingAction = 'reject';
    this.selectedTransaction = txn;
  }

  cancelAction(): void {
    this.pendingAction = null;
    this.selectedTransaction = null;
  }

  confirmAction(): void {
    if (!this.selectedTransaction || !this.pendingAction || this.actionInProgressId !== null) {
      return;
    }

    const id = this.selectedTransaction.id;
    this.actionInProgressId = id;
    const request = this.pendingAction === 'approve' ? this.transactionService.approve(id) : this.transactionService.reject(id);

    request.pipe(finalize(() => {
      this.actionInProgressId = null;
    })).subscribe({
      next: () => {
        this.pending = this.pending.filter((txn) => txn.id !== id);
        this.notificationService.show(
          this.pendingAction === 'approve' ? `Withdrawal request #${id} approved.` : `Withdrawal request #${id} rejected.`,
          this.pendingAction === 'approve' ? 'success' : 'info'
        );
        this.transactionService.notifyApprovalsUpdated();
        this.cancelAction();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
        this.cancelAction();
      }
    });
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';

    this.transactionService.getPendingApprovals().pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (rows) => {
        this.pending = rows;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      }
    });
  }
}
