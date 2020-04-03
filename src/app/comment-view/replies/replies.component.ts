import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentService } from 'src/app/services/comment.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-replies',
  templateUrl: './replies.component.html',
  styleUrls: ['./replies.component.scss'],
})
export class RepliesComponent implements OnInit {
  @Input() postId: string;
  @Input() commentId: string;
  replies$: Observable<any[]>;
  replyCount: number;

  constructor(private commentService: CommentService) { }

  ngOnInit() {
    this.replies$ = this.commentService.getReplies(this.postId, this.commentId).pipe(
      tap((arr: any[] = []) => this.replyCount = arr.length)
    );
  }

}
