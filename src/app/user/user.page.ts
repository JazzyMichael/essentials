import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PopoverController, ToastController } from '@ionic/angular';
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
    private toast: ToastController
  ) { }

  async ngOnInit() {
    const { value } = await Storage.get({ key: 'darkMode' });
    this.darkMode = !!value;
  }

  async darkToggle() {
    const enabled = document.body.classList.toggle('dark');
    if (enabled) {
      await Storage.set({ key: 'darkMode', value: 'enabled' });
    } else {
      await Storage.remove({ key: 'darkMode' });
    }
  }

  async logout() {
    await Storage.clear();
    await this.auth.logout();
  }

  editInfo() {
    this.router.navigateByUrl('/edit-user');
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

  }

}
