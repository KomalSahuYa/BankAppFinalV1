import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-message',
  templateUrl: './status-message.component.html'
})
export class StatusMessageComponent {
  @Input() type: 'success' | 'danger' | 'info' = 'info';
  @Input() message = '';
}
