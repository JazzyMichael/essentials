import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private auth: AngularFireAuth) {
    this.auth.authState
    // .pipe(
    //   // switchMap((user: any = {}) => {
    //   //   return user.uid ? this.firestore.doc(`users/${user.uid}`).valueChanges() : of(null);
    //   // })
    // )
    .subscribe(user => {
      console.log('user', user);
      this.user$.next(user);
    });
  }

  async login() {
    await this.auth.signInAnonymously();
  }

  async logout() {
    await this.auth.signOut();
  }

}
