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
    private follow: FollowService
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
    this.liked = true;
    await this.postService.likePost(this.postId, uid);
    console.log('liked');
    await this.follow.addFollower(`posts/${this.postId}`, uid);
    console.log('followed');
    const note = {
      icon: 'sunny',
      title,
      subtitle: 'You liked this post!',
      route: `/post/${this.postId}`,
      read: false
    };
    await this.notifications.addNotification(uid, note);
    console.log('notified');
    const temp = { postId: this.postId };
    this.postId = '';
    this.postId = temp.postId;
    this.following = true;
  }

  async unlike(title: string) {
    const toasty = await this.toast.create({
      message: 'Unliked :(',
      duration: 1500,
      position: 'top'
    });
    toasty.present();
    const { uid } = this.auth.user$.getValue();
    this.liked = false;
    await this.postService.unlikePost(this.postId, uid);
    console.log('unliked');
    await this.follow.removeFollower(`posts/${this.postId}`, uid);
    console.log('unfollowed');
    const note = {
      icon: 'thunderstorm',
      title,
      subtitle: 'You unliked this post',
      route: `/post/${this.postId}`,
      read: false
    };
    await this.notifications.addNotification(uid, note);
    console.log('notified');
    const temp = { postId: this.postId };
    this.postId = '';
    this.postId = temp.postId;
  }

  async toggleFollowing(follow: boolean) {
    const { uid } = (this.auth.user$.getValue() || { uid: null });

    if (!uid) return;

    if (follow) {
      await this.follow.addFollower(`posts/${this.postId}`, uid);
      console.log('followed');
    } else {
      await this.follow.removeFollower(`posts/${this.postId}`, uid);
      console.log('unfollowed');
    }
    const toasty = await this.toast.create({
      message: follow ? 'Following!' : 'Stopped following :(',
      duration: 1000,
      position: 'top'
    });
    toasty.present();
  }

  async addComment() {
    if (!this.comment) return;
    const { uid, username } = this.auth.user$.getValue();
    const newComment = {
      userId: uid,
      postId: this.postId,
      username,
      createdAt: new Date(),
      text: this.comment,
      likes: 0,
      followerIds: []
    };
    await this.commentService.createComment(newComment);
    console.log('commented');
    this.comment = '';
    const temp = { postId: this.postId };
    this.postId = '';
    const toasty = await this.toast.create({
      message: 'Comment added!',
      duration: 1500
    });
    toasty.present();
    await this.follow.addFollower(`posts/${this.postId}`, uid);
    console.log('followed');
    this.following = true;
    this.postId = temp.postId;
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
