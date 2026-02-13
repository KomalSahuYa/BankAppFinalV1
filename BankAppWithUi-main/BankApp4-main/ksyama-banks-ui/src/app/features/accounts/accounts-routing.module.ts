import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';

import { AccountListComponent } from './pages/account-list/account-list.component';
import { AccountCreateComponent } from './pages/account-create/account-create.component';
import { ClerkManagementComponent } from './pages/clerk-management/clerk-management.component';
import { AccountUpdateComponent } from './pages/account-update/account-update.component';

const routes: Routes = [
  { path: 'list', component: AccountListComponent, canActivate: [RoleGuard], data: { roles: ['MANAGER', 'CLERK'] } },
  { path: 'create', component: AccountCreateComponent, canActivate: [RoleGuard], data: { roles: ['MANAGER', 'CLERK'] } },
  { path: 'update/:accountNumber', component: AccountUpdateComponent, canActivate: [RoleGuard], data: { roles: ['MANAGER', 'CLERK'] } },
  { path: 'clerks', component: ClerkManagementComponent, canActivate: [RoleGuard], data: { roles: ['MANAGER'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule {}
