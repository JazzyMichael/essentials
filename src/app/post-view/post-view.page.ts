import { Component, OnInit } from '@angular/core';
import { ToastController, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.page.html',
  styleUrls: ['./post-view.page.scss'],
})
export class PostViewPage implements OnInit {
  following: boolean;

  constructor(
    private toast: ToastController,
    private actionSheet: ActionSheetController
  ) { }

  ngOnInit() {
    this.following = false;
  }

  async toggleFollowing() {
    const oldStatus = this.following;
    this.following = !this.following;
    const toasty = await this.toast.create({
      message: oldStatus ? 'Stopped following :(' : 'Following!',
      duration: 1000,
      position: 'top'
    });
    toasty.present();
  }

  async showActions() {
    const actions = await this.actionSheet.create({
      buttons: [
        {
          text: 'Share',
          icon: 'share-outline',
          handler: () => {
            this.sharePost().then(() => {
              console.log('shared');
            });
          }
        },
        {
          text: 'Report',
          role: 'destructive',
          icon: 'megaphone-outline',
          handler: () => {
            this.reportPost().then(() => {
              console.log('reported');
            });
          }
        }
      ]
    });
    await actions.present();
  }

  async sharePost() {
    return;
  }

  async reportPost() {
    const toasty = await this.toast.create({
      message: 'Post has been reported.',
      duration: 1234
    });
    toasty.present();
  }

}
