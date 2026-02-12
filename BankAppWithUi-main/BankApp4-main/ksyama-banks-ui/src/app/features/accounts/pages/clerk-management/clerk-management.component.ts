import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { AccountService } from '../../../../core/services/account.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { EmployeeResponse } from '../../../../core/models/account.model';

@Component({
  selector: 'app-clerk-management',
  templateUrl: './clerk-management.component.html'
})
export class ClerkManagementComponent implements OnInit {
  employees: EmployeeResponse[] = [];
  loading = false;
  isSubmitting = false;
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly accountService: AccountService,
    private readonly apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  createClerk(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.accountService.createEmployee({ ...this.form.getRawValue(), role: 'CLERK' }).subscribe({
      next: () => {
        this.form.reset({ username: '', password: '', fullName: '' });
        this.loadEmployees();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  private loadEmployees(): void {
    this.loading = true;
    this.accountService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
