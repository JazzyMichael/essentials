import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {
  user$: any;

  constructor(
    private toast: ToastController,
    private userService: UserService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.user$ = this.auth.user$.asObservable();
  }

  async logout() {
    await this.auth.logout();
  }

  async update(key: string, val: string = '') {
    const prettyVal = val.trim().toLowerCase();

    const { uid } = this.auth.user$.getValue();

    await this.userService.update(uid, key, prettyVal);

    const toasty = await this.toast.create({
      message: prettyVal ? `${key} changed to ${prettyVal}!` : `${key} was removed!`,
      duration: 1234
    });

    toasty.present();
  }

}
