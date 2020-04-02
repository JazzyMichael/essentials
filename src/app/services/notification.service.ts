import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications$: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(private firestore: AngularFirestore) { }

  markAsRead(userId: string, id: string) {
    return this.firestore
      .doc(`users/${userId}/notifications/${id}`)
      .update({ read: true });
  }

  getNotifications(userId: string) {
    if (!userId) return of([]);
    return this.firestore
      .collection(`users/${userId}/notifications`, ref => ref.orderBy('createdAt', 'desc'))
      .valueChanges({ idField: 'id' });
  }

  async addNotification(userId: string, obj: any) {
    const notification = {
      icon: obj.icon || 'cloudy-night',
      title: obj.title || 'Get notified! This is the title of the post',
      subtitle: obj.subtitle || 'blah asdt This is a sbutitle that should get trounkeabled and is the default',
      route: obj.route || '',
      read: false,
      createdAt: new Date()
    };

    await this.firestore
      .collection(`users/${userId}/notifications`)
      .add(notification);
  }
}
