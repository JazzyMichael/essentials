import { Component, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommentService } from 'src/app/services/comment.service';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

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
    private auth: AuthService,
    private userService: UserService
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

  async changeSort(event: any) {
    this.sort = event.target.value;
    if (this.infScr) this.infScr.disabled = false;
    const comments = await this.commentService.getReplies(this.postId, this.commentId, this.sort);
    this.lastReply = comments[comments.length - 1];
    this.replies$.next(comments);
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
    await this.commentService.likeReply(this.postId, this.commentId, reply.id, uid);
    console.log('liked');
    await this.userService.update(uid, 'likedReplyIds', [ ...this.user.likedReplyIds.slice(-99), reply.id ]);
    console.log('updated user likedReplyIds');
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
    console.log('unliked');
    await this.userService.update(uid, 'likedReplyIds', this.user.likedReplyIds.filter(id => id !== reply.id));
    console.log('updated user likedReplyIds');
  }

}
