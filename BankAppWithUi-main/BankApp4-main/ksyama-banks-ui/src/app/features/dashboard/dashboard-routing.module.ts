import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClerkDashboardComponent } from './pages/clerk-dashboard/clerk-dashboard.component';
import { ManagerDashboardComponent } from './pages/manager-dashboard/manager-dashboard.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  { path: 'clerk', component: ClerkDashboardComponent, canActivate: [RoleGuard], data: { roles: ['CLERK'] } },
  { path: 'manager', component: ManagerDashboardComponent, canActivate: [RoleGuard], data: { roles: ['MANAGER'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
