import { Component, OnInit } from '@angular/core';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';
import { AuthService } from '../services/auth.service';
import { switchMap, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';
import { ReportService } from 'src/app/services/report.service';
import { FollowService } from '../services/follow.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.page.html',
  styleUrls: ['./post-view.page.scss'],
})
export class PostViewPage implements OnInit {
  following: boolean;
  liked: boolean;
  post$: Observable<any>;
  postId: string;
  postUserId: string;
  postFollowerIds: string[];
  postTitle: string;
  comment: string;

  constructor(
    private toast: ToastController,
    private actionSheet: ActionSheetController,
    private route: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService,
    public auth: AuthService,
    private router: Router,
    private notifications: NotificationService,
    private reportService: ReportService,
    private follow: FollowService,
    private user: UserService
  ) { }

  ngOnInit() {
    this.following = false;
    this.post$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.postId = params.get('id');
        return this.postService.getPostById(this.postId);
      }),
      tap(post => {
        this.postUserId = post.userId;
        this.postFollowerIds = post.followerIds && post.followerIds.length ? post.followerIds : [];
        this.postTitle = post.title || '';
        const user = this.auth.user$.getValue();
        this.following = user && user.uid && this.postFollowerIds.includes(user.uid);
        this.liked = user && user.likedPostIds && user.likedPostIds.includes(this.postId);
      })
    );
  }

  async like(title: string) {
    const user = this.auth.user$.getValue();
    if (!user) {
      const toa = await this.toast.create({
        message: 'Login to like posts',
        duration: 2000,
        position: 'top'
      });
      toa.present();
      return this.router.navigateByUrl('/tabs/user');
    }
    const toasty = await this.toast.create({
      message: 'Liked Post :)',
      duration: 1500,
      position: 'top'
    });
    toasty.present();
    const uid = user.uid;
    user.likedPostIds = user.likedPostIds || [];
    this.liked = true;
    this.following = true;
    await this.postService.likePost(this.postId, uid);
    await this.user.update(uid, 'likedPostIds', [ ...user.likedPostIds.slice(-99), this.postId ]);
    console.log('liked');
    const oldId = this.postFollowerIds.length > 99 ? this.postFollowerIds[this.postFollowerIds.length - 1] : undefined;
    await this.follow.addFollower(`posts/${this.postId}`, uid, oldId);
    console.log('followed');
    this.liked = true;
    this.following = true;
  }

  async unlike(title: string) {
    const toasty = await this.toast.create({
      message: 'Unliked :(',
      duration: 1500,
      position: 'top'
    });
    toasty.present();
    let { uid, likedPostIds } = this.auth.user$.getValue();
    likedPostIds = likedPostIds && likedPostIds.length ? likedPostIds : [];
    this.liked = false;
    await this.postService.unlikePost(this.postId, uid);
    await this.user.update(uid, 'likedPostIds', likedPostIds.filter(id => id !== this.postId));
    console.log('unliked');
    this.liked = false;
  }

  async toggleFollowing() {
    const { uid } = (this.auth.user$.getValue() || { uid: null });

    if (!uid) return;

    const toasty = await this.toast.create({
      message: this.following ? 'Following!' : 'Stopped following :(',
      duration: 1000,
      position: 'top'
    });
    toasty.present();

    this.following = !this.following;

    if (this.following) {
      const oldId = this.postFollowerIds.length > 99 ? this.postFollowerIds[this.postFollowerIds.length - 1] : undefined;
      await this.follow.addFollower(`posts/${this.postId}`, uid, oldId);
      console.log('followed');
    } else {
      await this.follow.removeFollower(`posts/${this.postId}`, uid);
      console.log('unfollowed');
    }
  }

  async addComment() {
    if (!this.comment) return;
    const postId = this.postId;
    this.postId = '';
    const { uid, username } = this.auth.user$.getValue();
    const newComment = {
      userId: uid,
      postId,
      username,
      createdAt: new Date(),
      text: this.comment,
      likes: 0,
      followerIds: [uid]
    };
    await this.commentService.createComment(newComment);
    console.log('commented');
    this.comment = '';
    const toasty = await this.toast.create({
      message: 'Comment added!',
      duration: 1500
    });
    toasty.present();
    this.following = true;
    const oldId = this.postFollowerIds.length > 99 ? this.postFollowerIds[this.postFollowerIds.length - 1] : undefined;
    await this.follow.addFollower(`posts/${postId}`, uid, oldId);
    console.log('followed');
    this.postId = postId;
    await this.notifications.notify(this.postFollowerIds.slice(0, this.postFollowerIds.length - 1), {
      icon: 'ice-cream',
      title: this.postTitle,
      subtitle: 'New comment!',
      route: `/post-view/${postId}`
    });
    console.log('notified');
  }

  async showActions() {
    const buttons = [{
      text: 'Share',
      role: '',
      icon: 'share-outline',
      handler: () => {
        this.sharePost().then(() => {
          console.log('shared');
        });
      }
    }];

    const { uid } = this.auth.user$.getValue();

    if (this.postUserId === uid) {
      buttons.push({
        text: 'Delete',
        role: 'destructive',
        icon: 'trash-bin',
        handler: () => {
          this.deletePost().then(() => {
            console.log('deleted');
          });
        }
      });
    } else {
      buttons.push({
        text: 'Report',
        role: 'destructive',
        icon: 'megaphone-outline',
        handler: () => {
          this.reportPost().then(() => {
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

  async sharePost() {
    return;
  }

  async reportPost() {
    const user = this.auth.user$.getValue();
    const report = {
      type: 'post',
      postId: this.postId,
      postUserId: this.postUserId,
      userId: user ? user.uid : ''
    };
    await this.reportService.add(report);
    const toasty = await this.toast.create({
      message: 'Post has been reported.',
      duration: 1234
    });
    toasty.present();
  }

  async deletePost() {
    await this.postService.deletePost(this.postId);
    this.router.navigateByUrl('/user');
    const toasty = await this.toast.create({
      message: 'Post has been deleted.',
      duration: 1500
    });
    toasty.present();
  }

}
