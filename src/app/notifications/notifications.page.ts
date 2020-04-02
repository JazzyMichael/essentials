import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.page.html',
  styleUrls: ['notifications.page.scss']
})
export class NotificationsPage implements OnInit {
  notifications$: Observable<any[]>;

  constructor(private notif: NotificationService) {}

  ngOnInit() {
    this.notifications$ = this.notif.notifications$.asObservable();
  }

}
