import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PopoverController, ToastController } from '@ionic/angular';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { ColorPopoverComponent } from './color-popover/color-popover.component';
import { Plugins } from '@capacitor/core';

const { Storage, Share, Clipboard } = Plugins;

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  darkMode: boolean;

  constructor(
    public auth: AuthService,
    private router: Router,
    private popover: PopoverController,
    private toast: ToastController,
    private analytics: AngularFireAnalytics
  ) { }

  async ngOnInit() {
    const { value } = await Storage.get({ key: 'darkMode' });
    this.darkMode = !!value;
  }

  async darkToggle() {
    const enable = document.body.classList.toggle('dark');
    if (enable) {
      await Storage.set({ key: 'darkMode', value: 'enabled' });
      this.analytics.logEvent('dark-mode', { enabled: true });
    } else {
      await Storage.remove({ key: 'darkMode' });
      this.analytics.logEvent('dark-mode', { enabled: false });
    }
  }

  async logout() {
    await Storage.clear();
    await this.auth.logout();
    this.analytics.logEvent('logout');
  }

  editInfo() {
    this.router.navigateByUrl('/user-edit');
  }

  viewPosts(id: string) {
    this.router.navigateByUrl(`/user-posts/${id}`);
  }

  async showColorPopover(event: any) {
    const pop = await this.popover.create({
      component: ColorPopoverComponent,
      event
    });
    await pop.present();
  }

  async share() {
    try {
      await Share.share({
        title: 'Essentials Anonymous',
        text: 'Real stories from real essentials',
        url: 'http://essentialsanonymous.com/',
        dialogTitle: 'Share with buddies'
      });
    } catch (e) {
      await Clipboard.write({
        string: 'http://essentialsanonymous.com/'
      });
      const toasty = await this.toast.create({
        message: 'Link Copied :)',
        duration: 1234,
        position: 'top'
      });
      toasty.present();
    }
    this.analytics.logEvent('share');
  }

  adClick() {
    this.analytics.logEvent('ad-click');
    window.open('http://caronabalona.com/');
  }
}
