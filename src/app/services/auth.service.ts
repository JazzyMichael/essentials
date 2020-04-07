import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.auth.authState
    .pipe(
      switchMap((user: any) => {
        return user && user.uid ? this.firestore.doc(`users/${user.uid}`).valueChanges() : of(null);
      })
    )
    .subscribe(user => {
      console.log({ user });
      this.user$.next(user);
    });
  }

  updateUser(id: string, key: string, val: any) {
    return this.firestore.doc(`users/${id}`).update({ [key]: val });
  }

  async login() {
    await this.auth.signInAnonymously();
  }

  async logout() {
    await this.auth.signOut();
  }

}
