import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {

  constructor(private toast: ToastController) { }

  ngOnInit() {
  }

  async update(key: string, val: string) {
    const toasty = await this.toast.create({
      message: val ? `${key} changed to ${val}!` : `${key} was removed!`,
      duration: 1234
    });
    toasty.present();
  }

}
