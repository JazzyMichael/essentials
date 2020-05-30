import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications$: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(
    private firestore: AngularFirestore,
    private functions: AngularFireFunctions
  ) { }

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

  async notify(followerIds: string[], obj: any) {
    const notification = {
      route: obj.route || '',
      icon: obj.icon || 'cloudy-night',
      title: obj.title || 'New!',
      subtitle: obj.subtitle || '',
      read: false,
      createdAt: new Date()
    };

    console.log('notify', { followerIds, notification });

    await this.functions.httpsCallable('notify')({ followerIds, notification }).toPromise();
  }
}
