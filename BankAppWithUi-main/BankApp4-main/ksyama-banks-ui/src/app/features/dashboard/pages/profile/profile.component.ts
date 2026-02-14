import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../../core/services/auth.service';
import { AccountService } from '../../../../core/services/account.service';
import { EmployeeResponse } from '../../../../core/models/account.model';
import { PermissionService } from '../../../../core/services/permission.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  employee: EmployeeResponse | null = null;
  errorMessage = '';

  constructor(
    public readonly authService: AuthService,
    public readonly permissionService: PermissionService,
    private readonly accountService: AccountService,
    private readonly apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    if (!this.permissionService.canViewAllUsers()) {
      return;
    }

    this.accountService.getEmployees().subscribe({
      next: (employees) => {
        this.employee = employees.find((employee) => employee.username === this.authService.currentUserValue?.username) ?? null;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      }
    });
  }
}
