import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-intro-slides',
  templateUrl: './intro-slides.page.html',
  styleUrls: ['./intro-slides.page.scss'],
})
export class IntroSlidesPage implements OnInit, OnDestroy {
  userSub: Subscription;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.userSub = this.auth.user$.subscribe(user => {
      if (user && user.uid) this.router.navigateByUrl('/tabs');
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  async login() {
    await this.auth.login();
  }

}
