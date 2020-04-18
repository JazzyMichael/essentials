import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.page.html',
  styleUrls: ['./user-edit.page.scss'],
})
export class UserEditPage implements OnInit {
  user$: any;

  constructor(
    private toast: ToastController,
    private auth: AuthService,
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit() {
    this.user$ = this.auth.user$.asObservable();
  }

  async update(key: string, val: string = '') {
    const prettyVal = val.trim().toLowerCase();

    const { uid } = this.auth.user$.getValue();

    await this.auth.updateUser(uid, key, prettyVal);

    const toasty = await this.toast.create({
      message: prettyVal ? `${key} changed to ${prettyVal}!` : `${key} was removed!`,
      duration: 1234
    });

    toasty.present();

    this.analytics.logEvent('update-user', { field: key });
  }

}
