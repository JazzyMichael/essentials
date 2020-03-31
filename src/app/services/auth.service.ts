import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<any>;

  constructor(private auth: AngularFireAuth) {
    this.user$ = this.auth.authState;
    // this.user$ = this.auth.user.pipe(
    //   // switchMap((user: any = {}) => {
    //   //   return user.uid ? this.firestore.doc(`users/${user.uid}`).valueChanges() : of(null);
    //   // })
    // );
  }

  async login() {
    await this.auth.signInAnonymously();
  }

  async logout() {
    await this.auth.signOut();
  }

}
