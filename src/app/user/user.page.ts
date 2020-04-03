import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PopoverController } from '@ionic/angular';
import { ColorPopoverComponent } from './color-popover/color-popover.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  darkMode: boolean;

  constructor(
    private router: Router,
    public auth: AuthService,
    private popover: PopoverController
  ) { }

  ngOnInit() {
    this.darkMode = !!localStorage.getItem('darkMode');
  }

  darkToggle() {
    const enabled = document.body.classList.toggle('dark');
    if (enabled) {
      localStorage.setItem('darkMode', 'enabled');
    } else {
      localStorage.removeItem('darkMode');
    }
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
