import { Component } from '@angular/core';

import { AuthService } from '../../../../core/services/auth.service';
import { AccountService } from '../../../../core/services/account.service';
import { EmployeeResponse } from '../../../../core/models/account.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  employee: EmployeeResponse | null = null;

  constructor(public readonly authService: AuthService, private readonly accountService: AccountService) {
    this.accountService.getEmployees().subscribe((employees) => {
      this.employee = employees.find((employee) => employee.username === this.authService.currentUserValue?.username) ?? null;
    });
  }
}
