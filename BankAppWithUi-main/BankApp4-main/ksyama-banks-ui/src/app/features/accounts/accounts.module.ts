import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AccountsRoutingModule } from './accounts-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AccountListComponent } from './pages/account-list/account-list.component';
import { AccountCreateComponent } from './pages/account-create/account-create.component';
import { ClerkManagementComponent } from './pages/clerk-management/clerk-management.component';

@NgModule({
  declarations: [AccountListComponent, AccountCreateComponent, ClerkManagementComponent],
  imports: [CommonModule, ReactiveFormsModule, AccountsRoutingModule, SharedModule]
})
export class AccountsModule {}
