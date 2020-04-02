import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }

  update(id: string, key: string, val: string) {
    return this.firestore.doc(`users/${id}`).update({ [key]: val });
  }
}
