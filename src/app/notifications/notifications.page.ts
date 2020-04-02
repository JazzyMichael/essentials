import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.page.html',
  styleUrls: ['notifications.page.scss']
})
export class NotificationsPage implements OnInit {
  user: any;
  notifications$: Observable<any[]>;

  constructor(
    private notif: NotificationService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.user = user;
      const userId = user && user.uid;
      this.notifications$ = this.notif.getNotifications(userId);
    });
  }

  async markAsRead(id: string) {
    await this.notif.markAsRead(this.user.uid, id);
  }

}
