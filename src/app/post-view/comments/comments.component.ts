import { Component, Input, OnChanges } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { BehaviorSubject } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnChanges {
  @Input() postId: string;
  comments$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  commentCount: number;
  lastComment: any;
  sort: string = 'createdAt';
  infScr: any;

  constructor(
    private commentService: CommentService,
    private toast: ToastController,
    private auth: AuthService,
    private user: UserService
  ) { }

  async ngOnChanges() {
    console.log('change', this.postId);
    if (!this.postId) return;
    const comments = await this.commentService.getComments(this.postId, this.sort);
    this.lastComment = comments[comments.length - 1];
    this.commentCount = comments.length;
    this.comments$.next(comments);
  }

  async loadMore(event: any) {
    console.log('loading more');
    this.infScr = event.target;
    if (!this.postId || !this.sort || !this.lastComment) {
      event.target.complete();
      event.target.disabled = true;
      return;
    }
    const comments = await this.commentService.getMoreComments(this.postId, this.sort, this.lastComment);
    this.lastComment = comments[comments.length - 1];
    event.target.complete();
    if (!comments.length) {
      event.target.disabled = true;
    }
    const old = this.comments$.getValue();
    this.comments$.next([ ...old, ...comments ]);
  }

  async changeSort(event: any) {
    this.sort = event.target.value;
    if (this.infScr) this.infScr.disabled = false;
    const comments = await this.commentService.getComments(this.postId, this.sort);
    this.lastComment = comments[comments.length - 1];
    this.comments$.next(comments);
  }

  async likeComment(comment: any) {
    const user = this.auth.user$.getValue();
    if (!user || !user.uid) return;
    const uid = user.uid;
    await this.commentService.likeComment(this.postId, comment.id, uid);
    const toasty = await this.toast.create({
      message: 'Liked Comment :)',
      duration: 1500,
      position: 'top'
    });
    toasty.present();
    await this.user.update(uid, 'likedCommentIds', [ ...user.likedCommentIds.slice(-99), comment.id ]);
    comment.likes++;
    comment.liked = true;
  }

  async unlikeComment(comment: any) {
    const user = this.auth.user$.getValue();
    if (!user || !user.uid) return;
    const uid = user.uid;
    await this.commentService.unlikeComment(this.postId, comment.id, uid);
    const toasty = await this.toast.create({
      message: 'Unliked Comment :(',
      duration: 1500,
      position: 'top'
    });
    toasty.present();
    comment.likes--;
    comment.liked = false;
  }

}
