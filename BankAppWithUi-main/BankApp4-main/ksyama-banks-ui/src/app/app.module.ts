import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { ClerkDashboardComponent } from './features/dashboard/pages/clerk-dashboard/clerk-dashboard.component';
import { ManagerDashboardComponent } from './features/dashboard/pages/manager-dashboard/manager-dashboard.component';
import { DashboardHomeComponent } from './features/dashboard/pages/dashboard-home.component';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

@NgModule({
  declarations: [AppComponent, ClerkDashboardComponent, ManagerDashboardComponent, DashboardHomeComponent],
  imports: [BrowserModule, AppRoutingModule, SharedModule],
  providers: [provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor]))],
  bootstrap: [AppComponent]
})
export class AppModule {}
