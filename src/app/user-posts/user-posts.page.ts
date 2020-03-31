import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.page.html',
  styleUrls: ['./user-posts.page.scss'],
})
export class UserPostsPage implements OnInit {
  posts$: Observable<any>;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.posts$ = this.postService.getPostsByUserId('userId');
  }

}
