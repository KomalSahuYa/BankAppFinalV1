import { Component } from '@angular/core';

import { PermissionService } from '../../../core/services/permission.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(public readonly permissionService: PermissionService) {}

  refreshPage(): void {
    window.location.reload();
  }
}
