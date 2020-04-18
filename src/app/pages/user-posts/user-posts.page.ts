import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.page.html',
  styleUrls: ['./user-posts.page.scss'],
})
export class UserPostsPage implements OnInit {
  posts$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.posts$ = this.route.paramMap.pipe(
      switchMap(params => {
        const userId = params.get('id');
        return this.postService.getPostsByUserId(userId);
      })
    );
  }

}
