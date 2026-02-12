import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { AccountService } from '../../../../core/services/account.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html'
})
export class AccountCreateComponent {
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    holderName: ['', Validators.required],
    initialBalance: [0, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly accountService: AccountService,
    private readonly apiErrorService: ApiErrorService
  ) {}

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.accountService.createAccount(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.successMessage = `Account ${response.accountNumber} created successfully.`;
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
