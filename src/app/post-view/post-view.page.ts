import { Component, OnInit } from '@angular/core';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.page.html',
  styleUrls: ['./post-view.page.scss'],
})
export class PostViewPage implements OnInit {
  following: boolean;
  post$: Observable<any>;

  constructor(
    private toast: ToastController,
    private actionSheet: ActionSheetController,
    private route: ActivatedRoute,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.following = false;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.post$ = this.postService.getPostById(id);
    });
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
