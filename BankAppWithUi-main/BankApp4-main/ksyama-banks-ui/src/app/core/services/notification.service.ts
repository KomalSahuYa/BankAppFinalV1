import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'danger' | 'info' | 'warning';

export interface AppNotification {
  id: number;
  message: string;
  type: NotificationType;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 1;
  private readonly notificationsState = new BehaviorSubject<AppNotification[]>([]);

  readonly notifications$ = this.notificationsState.asObservable();

  show(message: string, type: NotificationType = 'info', durationMs = 4000): void {
    const notification: AppNotification = {
      id: this.nextId++,
      message,
      type
    };

    this.notificationsState.next([...this.notificationsState.value, notification]);

    if (durationMs > 0) {
      setTimeout(() => this.dismiss(notification.id), durationMs);
    }
  }

  dismiss(id: number): void {
    this.notificationsState.next(this.notificationsState.value.filter((item) => item.id !== id));
  }

  clear(): void {
    this.notificationsState.next([]);
  }
}
