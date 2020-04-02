import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  hideAnnouncement: boolean;
  posts$: Observable<any>;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.posts$ = this.postService.getPosts();
  }

  loadMore(event: any) {
    console.log({ loadMore: event });
    event.target.disabled = true;
    // this.posts$ = this.postService.getMorePosts('', {});
  }

  changeSort(event: any) {
    this.posts$ = this.postService.getPosts(event.target.value);
  }
}
