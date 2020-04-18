import { Component, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommentService } from 'src/app/services/comment.service';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-replies',
  templateUrl: './replies.component.html',
  styleUrls: ['./replies.component.scss'],
})
export class RepliesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() postId: string;
  @Input() commentId: string;
  @Input() postUserId: string;
  @Input() commentUserId: string;

  replies$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  replyCount: number;
  lastReply: any;
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
    if (!this.postId || !this.commentId) return;
    const replies = await this.commentService.getReplies(this.postId, this.commentId, this.sort);
    this.lastReply = replies[replies.length - 1];
    this.replyCount = replies.length;
    this.replies$.next(replies);
  }

  async loadMore(event: any) {
    console.log('loading more');
    this.infScr = event.target;
    if (!this.postId || !this.commentId || !this.sort || !this.lastReply) {
      event.target.complete();
      event.target.disabled = true;
      return;
    }
    const comments = await this.commentService.getMoreReplies(this.postId, this.commentId, this.sort, this.lastReply);
    this.lastReply = comments[comments.length - 1];
    event.target.complete();
    if (!comments.length) {
      event.target.disabled = true;
    }
    const old = this.replies$.getValue();
    this.replies$.next([ ...old, ...comments ]);
  }

  async changeSort() {
    this.sort = this.sort === 'createdAt' ? 'likes' : 'createdAt';
    if (this.infScr) this.infScr.disabled = false;
    const comments = await this.commentService.getReplies(this.postId, this.commentId, this.sort);
    this.lastReply = comments[comments.length - 1];
    this.replies$.next(comments);
  }

  iconName(comment, user) {
    if (user && user.uid && comment && comment.likedIds && comment.likedIds.includes(user.uid) || comment.liked) {
      return 'thumbs-up';
    } else {
      return 'thumbs-up-outline';
    }
  }

  async toggleLike(comment: any) {
    if (!this.user || !comment) return console.log('nope');
    if (comment && comment.likedIds && comment.likedIds.includes(this.user.uid)) {
      await this.unlikeReply(comment);
    } else {
      await this.likeReply(comment);
    }
  }

  async likeReply(reply: any) {
    if (!this.user) return;
    const uid = this.user.uid;
    const toasty = await this.toast.create({
      message: 'Liked Comment :)',
      duration: 1500,
      position: 'top'
    });
    toasty.present();
    reply.likes++;
    reply.liked = true;
    await this.commentService.likeReply(this.postId, this.commentId, reply.id, uid, reply.likedIds, reply.followerIds);
  }

  async unlikeReply(reply: any) {
    if (!this.user) return;
    const uid = this.user.uid;
    const toasty = await this.toast.create({
      message: 'Unliked Comment :(',
      duration: 1500,
      position: 'top'
    });
    toasty.present();
    reply.likes--;
    reply.liked = false;
    await this.commentService.unlikeReply(this.postId, this.commentId, reply.id, uid);
  }

}
