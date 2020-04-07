import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() postId: string;
  comments$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  commentCount: number;
  lastComment: any;
  sort: string = 'createdAt';
  infScr: any;
  userSub: Subscription;
  user: any;

  constructor(
    private commentService: CommentService,
    private toast: ToastController,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.userSub = this.auth.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  async ngOnChanges() {
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

  async changeSort() {
    this.sort = this.sort === 'createdAt' ? 'likes' : 'createdAt';
    if (this.infScr) this.infScr.disabled = false;
    const comments = await this.commentService.getComments(this.postId, this.sort);
    this.lastComment = comments[comments.length - 1];
    this.comments$.next(comments);
  }

  async likeComment(comment: any) {
    if (!this.user || !this.user.uid) return;
    const uid = this.user.uid;
    await this.commentService.likeComment(this.postId, comment.id, uid);
    const toasty = await this.toast.create({
      message: 'Liked Comment :)',
      duration: 1500,
      position: 'top'
    });
    toasty.present();
    comment.likes++;
    comment.liked = true;
    await this.auth.updateUser(uid, 'likedCommentIds', [ ...this.user.likedCommentIds.slice(-99), comment.id ]);
  }

  async unlikeComment(comment: any) {
    if (!this.user || !this.user.uid) return;
    const uid = this.user.uid;
    await this.commentService.unlikeComment(this.postId, comment.id, uid);
    const toasty = await this.toast.create({
      message: 'Unliked Comment :(',
      duration: 1500,
      position: 'top'
    });
    toasty.present();
    comment.likes--;
    comment.liked = false;
    await this.auth.updateUser(uid, 'likedCommentIds', this.user.likedCommentIds.filter(id => id !== comment.id));
  }

}
