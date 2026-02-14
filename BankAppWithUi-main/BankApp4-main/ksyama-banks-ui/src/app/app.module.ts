import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ClerkDashboardComponent } from './features/dashboard/pages/clerk-dashboard/clerk-dashboard.component';
import { DashboardHomeComponent } from './features/dashboard/pages/dashboard-home.component';
import { ManagerDashboardComponent } from './features/dashboard/pages/manager-dashboard/manager-dashboard.component';
import { CalendarComponent } from './features/dashboard/pages/calendar/calendar.component';
import { ProfileComponent } from './features/dashboard/pages/profile/profile.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, ClerkDashboardComponent, ManagerDashboardComponent, DashboardHomeComponent, CalendarComponent, ProfileComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, SharedModule],
  providers: [
    provideHttpClient(withInterceptors([errorInterceptor]), withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
