import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import jsPDF from 'jspdf';

import { TransactionService } from '../../../../core/services/transaction.service';
import { TransactionResponse } from '../../../../core/models/transaction.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { trimmedRequiredValidator } from '../../../../core/validators/form-validators';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html'
})
export class TransactionHistoryComponent {
  loading = false;
  errorMessage = '';
  hasSearched = false;
  transactions: TransactionResponse[] = [];
  page = 1;
  readonly pageSize = 8;
  includePerformedByInPdf = false;

  readonly form = this.fb.nonNullable.group({
    accountNumber: ['', [Validators.required, trimmedRequiredValidator]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly transactionService: TransactionService,
    private readonly apiErrorService: ApiErrorService
  ) {}

  search(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.hasSearched = true;
    this.transactions = [];

    this.transactionService.getHistory(this.form.controls.accountNumber.value.trim()).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (rows) => {
        this.transactions = rows;
        this.page = 1;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      }
    });
  }

  downloadPdf(): void {
    if (!this.transactions.length) {
      this.errorMessage = 'No transactions available to download.';
      return;
    }

    const accountNumber = this.form.controls.accountNumber.value.trim();
    const doc = new jsPDF();
    let y = 12;

    doc.setFontSize(14);
    doc.text(`Transaction History - ${accountNumber}`, 10, y);
    y += 8;

    doc.setFontSize(10);
    const headers = this.includePerformedByInPdf
      ? ['ID', 'Type', 'Amount', 'Status', 'Timestamp', 'Performed By']
      : ['ID', 'Type', 'Amount', 'Status', 'Timestamp'];
    doc.text(headers.join(' | '), 10, y);
    y += 6;

    for (const txn of this.transactions) {
      const row = this.includePerformedByInPdf
        ? [txn.id, txn.type, txn.amount, txn.status, new Date(txn.timestamp).toLocaleString(), txn.performedBy || 'SYSTEM']
        : [txn.id, txn.type, txn.amount, txn.status, new Date(txn.timestamp).toLocaleString()];

      doc.text(row.join(' | '), 10, y);
      y += 6;

      if (y > 280) {
        doc.addPage();
        y = 12;
      }
    }

    doc.save(`transaction-history-${accountNumber}.pdf`);
  }

  get pagedTransactions(): TransactionResponse[] {
    const start = (this.page - 1) * this.pageSize;
    return this.transactions.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.transactions.length / this.pageSize));
  }

  nextPage(): void {
    this.page = Math.min(this.totalPages, this.page + 1);
  }

  prevPage(): void {
    this.page = Math.max(1, this.page - 1);
  }

  getStatusClass(status: string): string {
    if (status === 'APPROVED') return 'bg-success-subtle text-success-emphasis';
    if (status === 'PENDING_APPROVAL') return 'bg-warning-subtle text-warning-emphasis';
    if (status === 'REJECTED') return 'bg-danger-subtle text-danger-emphasis';
    return 'bg-secondary-subtle';
  }
}
