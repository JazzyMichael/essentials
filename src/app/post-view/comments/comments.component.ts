import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @Input() postId: string;
  comments$: Observable<any[]>;
  commentCount: number;

  constructor(private commentService: CommentService) { }

  ngOnInit() {
    this.comments$ = this.commentService.getComments(this.postId).pipe(
      tap((arr: any[] = []) => this.commentCount = arr.length)
    );
  }

}
