import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PopoverController } from '@ionic/angular';
import { ColorPopoverComponent } from './color-popover/color-popover.component';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

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
    private popover: PopoverController
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

}
