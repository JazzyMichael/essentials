import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Observable, of, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.page.html',
  styleUrls: ['notifications.page.scss']
})
export class NotificationsPage implements OnInit, OnDestroy {
  user: any;
  userSub: Subscription;
  notifications$: Observable<any[]>;

  constructor(
    private notif: NotificationService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.userSub = this.auth.user$.subscribe(user => {
      this.user = user;
      const userId = user && user.uid;
      this.notifications$ = this.notif.getNotifications(userId);
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  async markAsRead(id: string) {
    await this.notif.markAsRead(this.user.uid, id);
  }

}
