import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../core/services/auth.service';
import { ApiErrorService } from '../../../core/services/api-error.service';
import { NotificationService } from '../../../core/services/notification.service';
import { trimmedRequiredValidator } from '../../../core/validators/form-validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isSubmitting = false;
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, trimmedRequiredValidator]],
    password: ['', Validators.required],
    rememberMe: [true]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly apiErrorService: ApiErrorService,
    private readonly notificationService: NotificationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService
      .login(
        {
          username: this.form.controls.username.value.trim(),
          password: this.form.controls.password.value
        },
        this.form.controls.rememberMe.value
      )
      .subscribe({
        next: () => {
          this.notificationService.show('Welcome. Authentication successful.', 'success');
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
          void this.router.navigateByUrl(returnUrl);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.apiErrorService.getMessage(error);
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }
}
