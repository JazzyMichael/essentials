import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.page.html',
  styleUrls: ['notifications.page.scss']
})
export class NotificationsPage implements OnInit {
  notifications: any[];

  constructor() {}

  ngOnInit() {
    this.notifications = [
      { icon: 'cloudy-night', title: 'Post title', subtitle: 'subtitle of the post truncated alsdkjf a;dklsjf a;slkdfj a;sldkfasd;lfkjsadl;kfsdf', route: '', read: true },
      { icon: 'chatbox', title: 'Post title', subtitle: 'subtitle of the post truncated', route: '', read: true },
      { icon: 'alert-circle', title: 'Post title', subtitle: 'subtitle of the post truncated', route: '', read: true },
      { icon: 'chatbubbles', title: 'Post title', subtitle: 'subtitle of the post truncated', route: '', read: false },
      { icon: 'cloudy-night', title: 'Post title', subtitle: 'subtitle of the post truncated', route: '', read: true },
      { icon: 'chatbox', title: 'Post title', subtitle: 'subtitle of the post truncated', route: '', read: false },
      { icon: 'alert-circle', title: 'Post title', subtitle: 'subtitle of the post truncated', route: '', read: false },
      { icon: 'chatbubbles', title: 'Post title', subtitle: 'subtitle of the post truncated', route: '', read: false },
      { icon: 'cloudy-night', title: 'Post title', subtitle: 'subtitle of the post truncated', route: '', read: true },
      { icon: 'chatbox', title: 'Post title', subtitle: 'subtitle of the post truncated', route: '', read: true },
      { icon: 'alert-circle', title: 'Post title', subtitle: 'subtitle of the post truncated', route: '', read: false },
      { icon: 'chatbubbles', title: 'Post title', subtitle: 'subtitle of the post truncated', route: '', read: false },
      { icon: 'cloudy-night', title: 'Post title', subtitle: 'subtitle of the post truncated', route: '', read: false },
      { icon: 'chatbox', title: 'Post title', subtitle: 'subtitle of the post truncated', route: '', read: true },
      { icon: 'alert-circle', title: 'Post title', subtitle: 'subtitle of the post truncated', route: '', read: true },
      { icon: 'chatbubbles', title: 'Post title', subtitle: 'subtitle of the post truncated', route: '', read: true }
    ];
  }

}
