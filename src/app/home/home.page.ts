import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  hideAnnouncement: boolean;
  posts$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  sort: string = 'createdAt';
  lastPost: any;
  infScr: any;

  constructor(private postService: PostService) { }

  async ngOnInit() {
    const posts = await this.postService.getFirst(this.sort);
    this.lastPost = posts[posts.length - 1];
    this.posts$.next(posts);
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
}
