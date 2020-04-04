import { Component, Input, OnChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-replies',
  templateUrl: './replies.component.html',
  styleUrls: ['./replies.component.scss'],
})
export class RepliesComponent implements OnChanges {
  @Input() postId: string;
  @Input() commentId: string;
  replies$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  replyCount: number;
  lastReply: any;
  sort: string = 'createdAt';
  infScr: any;

  constructor(private commentService: CommentService) { }

  async ngOnChanges() {
    if (!this.postId || !this.commentId) return;
    const replies = await this.commentService.getReplies(this.postId, this.commentId, this.sort);
    this.lastReply = replies[replies.length - 1];
    this.replyCount = replies.length;
    this.replies$.next(replies);
  }

  async loadMore(event: any) {
    console.log('loading more');
    this.infScr = event.target;
    const comments = await this.commentService.getMoreReplies(this.postId, this.commentId, this.sort, this.lastReply);
    this.lastReply = comments[comments.length - 1];
    event.target.complete();
    if (!comments.length) {
      event.target.disabled = true;
    }
    const old = this.replies$.getValue();
    this.replies$.next([ ...old, ...comments ]);
  }

  async changeSort(event: any) {
    this.sort = event.target.value;
    if (this.infScr) this.infScr.disabled = false;
    const comments = await this.commentService.getReplies(this.postId, this.commentId, this.sort);
    this.lastReply = comments[comments.length - 1];
    this.replies$.next(comments);
  }

}
