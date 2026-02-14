import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClerkDashboardComponent } from './pages/clerk-dashboard/clerk-dashboard.component';
import { ManagerDashboardComponent } from './pages/manager-dashboard/manager-dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { ProfileComponent } from './pages/profile/profile.component';

@NgModule({
  declarations: [ClerkDashboardComponent, ManagerDashboardComponent, CalendarComponent, ProfileComponent],
  imports: [CommonModule, DashboardRoutingModule]
})
export class DashboardModule {}
