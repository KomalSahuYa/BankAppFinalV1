import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AccountService } from '../../../../core/services/account.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { EmployeeResponse } from '../../../../core/models/account.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { trimmedRequiredValidator } from '../../../../core/validators/form-validators';
import { PermissionService } from '../../../../core/services/permission.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-clerk-management',
  templateUrl: './clerk-management.component.html',
  styleUrls: ['./clerk-management.component.scss']
})
export class ClerkManagementComponent implements OnInit {
  employees: EmployeeResponse[] = [];
  loading = false;
  isSubmitting = false;
  actionInProgress = false;
  errorMessage = '';
  editingEmployeeId: number | null = null;
  employeeToDelete: EmployeeResponse | null = null;
  showCreateForm = false;
  showCreateConfirm = false;
  usernameExists = false;

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, trimmedRequiredValidator]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', [Validators.required, trimmedRequiredValidator]],
    emailId: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    aadhaarNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{12}$/)]]
  });

  readonly editForm = this.fb.nonNullable.group({
    fullName: [{ value: '', disabled: true }, [Validators.required]],
    aadhaarNumber: [{ value: '', disabled: true }, [Validators.required]],
    emailId: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly accountService: AccountService,
    private readonly apiErrorService: ApiErrorService,
    private readonly notificationService: NotificationService,
    public readonly permissionService: PermissionService,
    private readonly userService: UserService
  ) {}

  get clerks(): EmployeeResponse[] {
    return this.employees.filter((employee) => employee.role === 'CLERK');
  }

  ngOnInit(): void {
    this.form.controls.username.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      const username = value.trim();
      if (!username) {
        this.usernameExists = false;
        return;
      }

      this.userService.checkUsernameExists(username).subscribe((exists) => {
        this.usernameExists = exists;
        if (exists) {
          this.form.controls.username.setErrors({ ...(this.form.controls.username.errors ?? {}), duplicate: true });
        }
      });
    });

    if (this.permissionService.canViewAllUsers()) {
      this.loadEmployees();
    }
  }

  openCreateForm(): void {
    this.showCreateForm = true;
  }

  createClerk(): void {
    if (this.form.invalid || this.isSubmitting || this.usernameExists) {
      this.form.markAllAsTouched();
      return;
    }

    this.showCreateConfirm = true;
  }

  closeCreateConfirm(): void {
    this.showCreateConfirm = false;
  }

  confirmCreateClerk(): void {
    this.showCreateConfirm = false;
    this.isSubmitting = true;
    this.errorMessage = '';

    this.accountService
      .createEmployee({
        ...this.form.getRawValue(),
        username: this.form.controls.username.value.trim(),
        fullName: this.form.controls.fullName.value.trim(),
        emailId: this.form.controls.emailId.value.trim().toLowerCase(),
        phoneNumber: this.form.controls.phoneNumber.value.trim(),
        aadhaarNumber: this.form.controls.aadhaarNumber.value.trim(),
        role: 'CLERK'
      })
      .pipe(finalize(() => {
        this.isSubmitting = false;
      }))
      .subscribe({
        next: () => {
          this.form.reset({ username: '', password: '', fullName: '', emailId: '', phoneNumber: '', aadhaarNumber: '' });
          this.notificationService.show('Clerk user created successfully.', 'success');
          this.showCreateForm = false;
          this.loadEmployees();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.apiErrorService.getMessage(error);
        }
      });
  }

  loadEmployees(): void {
    this.loading = true;
    this.accountService.getEmployees().pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      }
    });
  }

  startEdit(employee: EmployeeResponse): void {
    this.editingEmployeeId = employee.id;
    this.editForm.reset({ fullName: employee.fullName, aadhaarNumber: employee.aadhaarNumber, emailId: employee.emailId, phoneNumber: employee.phoneNumber });
  }

  cancelEdit(): void {
    this.editingEmployeeId = null;
    this.editForm.reset({ fullName: '', aadhaarNumber: '', emailId: '', phoneNumber: '' });
  }

  updateEmployee(employee: EmployeeResponse): void {
    if (this.editForm.invalid || this.actionInProgress) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.actionInProgress = true;
    this.errorMessage = '';
    this.accountService
      .updateEmployee(employee.id, {
        emailId: this.editForm.controls.emailId.value.trim().toLowerCase(),
        phoneNumber: this.editForm.controls.phoneNumber.value.trim()
      })
      .pipe(finalize(() => {
        this.actionInProgress = false;
      }))
      .subscribe({
        next: () => {
          this.notificationService.show('Employee updated successfully.', 'success');
          this.cancelEdit();
          this.loadEmployees();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.apiErrorService.getMessage(error);
        }
      });
  }

  askDeleteEmployee(employee: EmployeeResponse): void {
    if (!this.actionInProgress) {
      this.employeeToDelete = employee;
    }
  }

  cancelDelete(): void {
    this.employeeToDelete = null;
  }

  confirmDeleteEmployee(): void {
    if (!this.employeeToDelete || this.actionInProgress) {
      return;
    }

    const employee = this.employeeToDelete;
    this.employeeToDelete = null;
    this.actionInProgress = true;
    this.errorMessage = '';

    this.accountService.deleteEmployee(employee.id).pipe(finalize(() => {
      this.actionInProgress = false;
    })).subscribe({
      next: () => {
        this.notificationService.show('Employee deleted successfully.', 'success');
        this.cancelEdit();
        this.loadEmployees();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      }
    });
  }
}
