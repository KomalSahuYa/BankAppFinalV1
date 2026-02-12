import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { AccountService } from '../../../../core/services/account.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { positiveAmountValidator, trimmedRequiredValidator } from '../../../../core/validators/form-validators';

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html'
})
export class AccountCreateComponent {
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    holderName: ['', [Validators.required, trimmedRequiredValidator]],
    initialBalance: [0, [Validators.required, Validators.min(0.01), positiveAmountValidator(0.01)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly accountService: AccountService,
    private readonly apiErrorService: ApiErrorService,
    private readonly notificationService: NotificationService
  ) {}

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.accountService
      .createAccount({
        holderName: this.form.controls.holderName.value.trim(),
        initialBalance: this.form.controls.initialBalance.value
      })
      .subscribe({
        next: (response) => {
          this.successMessage = `Account ${response.accountNumber} created successfully.`;
          this.notificationService.show(this.successMessage, 'success');
          this.form.reset({ holderName: '', initialBalance: 0 });
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.apiErrorService.getMessage(error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }
}
