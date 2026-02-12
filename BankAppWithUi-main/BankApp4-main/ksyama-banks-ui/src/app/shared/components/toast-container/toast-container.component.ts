import { Component } from '@angular/core';

import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html'
})
export class ToastContainerComponent {
  constructor(public readonly notificationService: NotificationService) {}
}
