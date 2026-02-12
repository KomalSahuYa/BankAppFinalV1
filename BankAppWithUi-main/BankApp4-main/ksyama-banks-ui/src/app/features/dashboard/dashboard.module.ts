import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClerkDashboardComponent } from './pages/clerk-dashboard/clerk-dashboard.component';
import { ManagerDashboardComponent } from './pages/manager-dashboard/manager-dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [ClerkDashboardComponent, ManagerDashboardComponent],
  imports: [CommonModule, DashboardRoutingModule]
})
export class DashboardModule {}
