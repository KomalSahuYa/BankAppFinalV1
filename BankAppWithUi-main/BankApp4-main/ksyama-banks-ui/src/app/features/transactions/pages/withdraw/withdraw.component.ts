import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { TransactionService } from '../../../../core/services/transaction.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { WITHDRAWAL_MANAGER_APPROVAL_LIMIT } from '../../../../core/constants/business-rules';
import { positiveAmountValidator, trimmedRequiredValidator } from '../../../../core/validators/form-validators';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html'
})
export class WithdrawComponent {
  readonly managerApprovalLimit = WITHDRAWAL_MANAGER_APPROVAL_LIMIT;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    accountNumber: ['', [Validators.required, trimmedRequiredValidator]],
    amount: [0, [Validators.required, Validators.min(0.01), positiveAmountValidator(0.01)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly transactionService: TransactionService,
    private readonly apiErrorService: ApiErrorService,
    private readonly notificationService: NotificationService
  ) {}

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      accountNumber: this.form.controls.accountNumber.value.trim(),
      amount: this.form.controls.amount.value
    };

    const needsApproval = this.transactionService.needsApproval(payload.amount);
    const approvalHint = needsApproval ? ' This amount requires manager approval.' : ' This amount will be auto-approved.';
    const confirmed = window.confirm(
      `Confirm withdrawal of ₹${payload.amount.toLocaleString('en-IN')} from account ${payload.accountNumber}?${approvalHint}`
    );

    if (!confirmed) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.transactionService.withdraw(payload).subscribe({
      next: (res) => {
        this.successMessage =
          res.status === 'PENDING_APPROVAL'
            ? `Withdrawal request #${res.id} submitted and is pending manager approval.`
            : `Withdrawal request #${res.id} completed successfully.`;
        this.notificationService.show(this.successMessage, res.status === 'PENDING_APPROVAL' ? 'warning' : 'success');
        this.form.reset({ accountNumber: '', amount: 0 });
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  getAmountWarning(): string | null {
    const amount = this.form.controls.amount.value;
    if (amount > this.managerApprovalLimit) {
      return `Amount exceeds ₹${this.managerApprovalLimit.toLocaleString('en-IN')}. Manager approval will be required.`;
    }

    return null;
  }
}
