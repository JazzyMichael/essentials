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
import { Plugins } from '@capacitor/core';

const { Share, Clipboard } = Plugins;

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
  postLikedIds: string[];
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
        console.log({ post });
        this.postUserId = post.userId;
        this.postFollowerIds = post.followerIds && post.followerIds.length ? post.followerIds : [];
        this.postLikedIds = post.likedIds && post.likedIds.length ? post.likedIds : [];
        this.postTitle = post.title || '';
        const user = this.auth.user$.getValue();
        this.following = user && user.uid && this.postFollowerIds.includes(user.uid);
        this.liked = user && user.uid && this.postLikedIds.includes(user.uid);
      })
    );
  }

  async like(postId: string, postLikedIds: string[], postFollowerIds: string[]) {
    const toasty = await this.toast.create({
      message: 'Liked Post :)',
      duration: 1500,
      position: 'top'
    });
    toasty.present();
    const { uid } = this.auth.user$.getValue();
    this.liked = true;
    this.following = true;
    await this.postService.likePost(this.postId, uid, postLikedIds, postFollowerIds);
  }

  async unlike(postId: string) {
    const toasty = await this.toast.create({
      message: 'Unliked :(',
      duration: 1500,
      position: 'top'
    });
    toasty.present();
    const { uid } = this.auth.user$.getValue();
    this.liked = false;
    await this.postService.unlikePost(this.postId, uid);
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
    // create comment
    // notify post followers
    // update post followers
    if (!this.comment) return;
    const postId = this.postId;
    this.postId = '';
    const { uid, username } = this.auth.user$.getValue();
    const newComment = {
      userId: uid,
      postId,
      postUserId: this.postUserId,
      username,
      createdAt: new Date(),
      text: this.comment,
      likes: 0,
      followerIds: [uid],
      likedIds: []
    };

    await this.commentService.createComment(newComment);

    this.comment = '';

    const toasty = await this.toast.create({
      message: 'Comment added!',
      duration: 1500
    });
    toasty.present();

    this.following = true;
    const oldId = this.postFollowerIds.length > 99 ? this.postFollowerIds[this.postFollowerIds.length - 1] : undefined;

    await this.follow.addFollower(`posts/${postId}`, uid, oldId);

    await this.notifications.notify(this.postFollowerIds, {
      icon: 'ice-cream',
      title: this.postTitle,
      subtitle: 'New comment!',
      route: `/post-view/${postId}`
    });

    this.postId = postId;
  }

  async showActions() {
    const buttons = [{
      text: 'Share',
      role: '',
      icon: 'share-outline',
      handler: () => {
        this.share().then(() => {
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
          this.delete().then(() => {
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
          this.report().then(() => {
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

  async share() {
    try {
      await Share.share({
        title: 'Essentials Anonymous',
        text: this.postTitle || 'Real stories from real essentials',
        url: `http://essentialsanonymous.com/post-view/${this.postId}`,
        dialogTitle: 'Share with buddies'
      });
    } catch (e) {
      await Clipboard.write({
        string: `http://essentialsanonymous.com/post-view/${this.postId}`
      });
      const toasty = await this.toast.create({
        message: 'Link Copied :)',
        duration: 1234,
        position: 'top'
      });
      toasty.present();
    }

  }

  async report() {
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

  async delete() {
    await this.postService.deletePost(this.postId);
    this.router.navigateByUrl('/user');
    const toasty = await this.toast.create({
      message: 'Post has been deleted.',
      duration: 1500
    });
    toasty.present();
  }

}
