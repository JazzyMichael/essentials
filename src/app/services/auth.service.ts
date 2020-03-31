import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }

  login() {
    const user = {
      uid: 'uid',
      username: 'usernombre',
      location: '',
      job: '',
      company: '',
      likes: 6,
      posts: 2,
      recentSearches: []
    };

    this.user$.next(user);
  }

  logout() {
    this.user$.next(null);
  }

}
