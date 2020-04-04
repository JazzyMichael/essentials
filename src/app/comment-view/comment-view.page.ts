import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { CommentService } from '../services/comment.service';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-comment-view',
  templateUrl: './comment-view.page.html',
  styleUrls: ['./comment-view.page.scss'],
})
export class CommentViewPage implements OnInit {
  following: boolean;
  liked: boolean;

  comment$: Observable<any>;
  commentId: string;
  commentUserId: string;
  postId: string;
  reply: string;

  constructor(
    private toast: ToastController,
    private actionSheet: ActionSheetController,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private commentService: CommentService,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.comment$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.postId = params.get('postId');
        this.commentId = params.get('commentId');
        return this.commentService.getComment(this.postId, this.commentId);
      }),
      tap(comment => {
        this.commentUserId = comment.userId;
      })
    );
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

  async addReply() {
    const { uid, username } = this.auth.user$.getValue();
    const newReply = {
      userId: uid,
      postId: this.postId,
      commentId: this.commentId,
      username,
      createdAt: new Date(),
      text: this.reply
    };
    await this.commentService.reply(this.postId, this.commentId, newReply);
    this.reply = '';
    const toasty = await this.toast.create({
      message: 'Reply added!',
      duration: 1500
    });
    toasty.present();
    this.following = true;
  }

  async showActions() {
    const buttons = [];

    const { uid } = this.auth.user$.getValue();

    if (this.commentUserId === uid) {
      buttons.push({
        text: 'Delete Comment',
        role: 'destructive',
        icon: 'trash-bin',
        handler: () => {
          this.deleteComment().then(() => {
            console.log('deleted');
          });
        }
      });
    } else {
      buttons.push({
        text: 'Report Comment',
        role: 'destructive',
        icon: 'megaphone-outline',
        handler: () => {
          this.reportComment().then(() => {
            console.log('reported');
          });
        }
      });
    }

    const actions = await this.actionSheet.create({
      buttons
    });
    await actions.present();
  }

  async deleteComment() {
    await this.commentService.deleteComment(this.postId, this.commentId);
    this.router.navigateByUrl(`/post/${this.postId}`);
    const toasty = await this.toast.create({
      message: 'Comment has been deleted.',
      duration: 1500
    });
    toasty.present();
  }

  async reportComment() {
    const user = this.auth.user$.getValue();
    const report = {
      type: 'comment',
      postId: this.postId,
      commentId: this.commentId,
      commentUserId: this.commentUserId,
      userId: user ? user.uid : ''
    };
    await this.reportService.add(report);
    const toasty = await this.toast.create({
      message: 'Comment has been reported.',
      duration: 1234
    });
    toasty.present();
  }

}
