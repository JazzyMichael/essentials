import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-intro-slides',
  templateUrl: './intro-slides.page.html',
  styleUrls: ['./intro-slides.page.scss'],
})
export class IntroSlidesPage implements OnInit, OnDestroy {
  userSub: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private analytics: AngularFireAnalytics
  ) {}

  ngOnInit() {
    this.userSub = this.auth.user$.subscribe(user => {
      if (user && user.uid) this.router.navigateByUrl('/tabs');
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  async login() {
    this.router.navigateByUrl('/tabs');
    await this.auth.login();
    this.analytics.logEvent('login');
  }

  goToGithub() {
    window.open('https://github.com/Jappzy/essentials', '_blank');
  }

}
