import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications$: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor() {
    this.notifications$.next([
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
    ]);
  }

  markAsRead(id: string) {
    return;
  }
}
