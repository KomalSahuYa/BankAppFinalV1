import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { TransactionService } from '../../../../core/services/transaction.service';
import { TransactionResponse } from '../../../../core/models/transaction.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';

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
    private readonly apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  approve(id: number): void {
    if (this.actionInProgressId !== null) {
      return;
    }

    this.actionInProgressId = id;
    this.transactionService.approve(id).subscribe({
      next: () => this.load(),
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

    this.actionInProgressId = id;
    this.transactionService.reject(id).subscribe({
      next: () => this.load(),
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      },
      complete: () => {
        this.actionInProgressId = null;
      }
    });
  }

  private load(): void {
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
