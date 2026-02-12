import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from './components/layout/layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { StatusMessageComponent } from './components/status-message/status-message.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';

@NgModule({
  declarations: [LayoutComponent, SidebarComponent, TopbarComponent, StatusMessageComponent, ToastContainerComponent],
  imports: [CommonModule, RouterModule],
  exports: [LayoutComponent, StatusMessageComponent, ToastContainerComponent]
})
export class SharedModule {}
