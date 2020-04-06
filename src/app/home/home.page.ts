import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../services/post.service';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  hideAnnouncement: boolean;
  posts$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  sort: string = 'createdAt';
  lastPost: any;
  infScr: any;
  userSub: Subscription;
  userId: string;

  constructor(private postService: PostService, private auth: AuthService) { }

  async ngOnInit() {
    this.userSub = this.auth.user$.subscribe(user => {
      this.userId = user && user.uid || null;
    });
    const posts = await this.postService.getFirst(this.sort);
    this.lastPost = posts[posts.length - 1];
    this.posts$.next(posts);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  async loadMore(event: any) {
    console.log('loading more');
    this.infScr = event.target;
    const posts = this.sort === 'featured'
      ? await this.postService.getMoreFeatured(this.lastPost)
      : await this.postService.getMore(this.sort, this.lastPost);
    this.lastPost = posts[posts.length - 1];
    event.target.complete();
    if (!posts.length) {
      event.target.disabled = true;
    }
    const old = this.posts$.getValue();
    this.posts$.next([ ...old, ...posts ]);
  }

  async changeSort(event: any) {
    this.sort = event.target.value;
    if (this.infScr) this.infScr.disabled = false;
    const posts = this.sort === 'featured'
      ? await this.postService.getFirstFeatured()
      : await this.postService.getFirst(this.sort);
    this.lastPost = posts[posts.length - 1];
    this.posts$.next(posts);
  }

  adClick() {
    window.open('http://caronabalona.com/');
  }
}
