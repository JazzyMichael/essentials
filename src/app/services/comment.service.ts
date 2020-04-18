import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private firestore: AngularFirestore,
    private functions: AngularFireFunctions
  ) { }

  snapshotsToArray(snapshots: any) {
    const arrA = [];
    snapshots.forEach(doc => {
      arrA.push({ id: doc.id, ...doc.data() });
    });
    return arrA;
  }

  // C-reate

  createComment(obj: any) {
    // TODO: updated post comment count
    return this.firestore
      .collection(`posts/${obj.postId}/comments`)
      .add(obj);
  }

  createReply(postId: string, commentId: string, newReply: any) {
    // TODO: updated post comment count
    return this.firestore
      .collection(`posts/${postId}/comments/${commentId}/replies`)
      .add(newReply);
  }

  // R-ead

  getComments(postId: string, sort: string) {
    return this.firestore.collection(`posts/${postId}/comments`,
      ref => ref.orderBy(sort, 'desc').limit(6)
    ).get().pipe(map(this.snapshotsToArray)).toPromise();
  }

  getMoreComments(postId: string, sort: string, lastComment: any) {
    return this.firestore.collection(`posts/${postId}/comments`, ref =>
      ref.orderBy(sort, 'desc').startAfter(lastComment[sort]).limit(4)
    ).get().pipe(map(this.snapshotsToArray)).toPromise();
  }

  getReplies(postId: string, commentId: string, sort: string) {
    return this.firestore.collection(`posts/${postId}/comments/${commentId}/replies`,
      ref => ref.orderBy(sort, 'desc').limit(6)
    ).get().pipe(map(this.snapshotsToArray)).toPromise();
  }

  getMoreReplies(postId: string, commentId: string, sort: string, lastReply: any) {
    return this.firestore.collection(`posts/${postId}/comments/${commentId}/replies`, ref =>
      ref.orderBy(sort, 'desc').startAfter(lastReply[sort]).limit(4)
    ).get().pipe(map(this.snapshotsToArray)).toPromise();
  }

  watchComment(postId: string, commentId: string) {
    return this.firestore
      .doc(`posts/${postId}/comments/${commentId}`)
      .valueChanges();
  }

  // U-pdate

  likeComment(postId: string, commentId: string, userId: string, likedIds: string[], followerIds: string[]) {
    return this.functions
      .httpsCallable('like')({ doc: `posts/${postId}/comments/${commentId}`, userId, likedIds, followerIds })
      .toPromise();
  }

  unlikeComment(postId: string, commentId: string, userId: string) {
    return this.functions
      .httpsCallable('unlike')({ doc: `posts/${postId}/comments/${commentId}`, userId })
      .toPromise();
  }

  likeReply(postId: string, commentId: string, replyId: string, userId: string, likedIds: string[], followerIds: string[]) {
    return this.functions
      .httpsCallable('like')({ doc: `posts/${postId}/comments/${commentId}/replies/${replyId}`, userId, likedIds, followerIds })
      .toPromise();
  }

  unlikeReply(postId: string, commentId: string, replyId: string, userId: string) {
    return this.functions
      .httpsCallable('unlike')({ doc: `posts/${postId}/comments/${commentId}/replies/${replyId}`, userId })
      .toPromise();
  }

  // D-elete

  deleteComment(postId: string, commentId: string) {
    return this.firestore
      .doc(`posts/${postId}/comments/${commentId}`)
      .delete();
  }

  deleteReply(postId: string, commentId: string, replyId: string) {
    return this.firestore
      .doc(`posts/${postId}/comments/${commentId}/replies/${replyId}`)
      .delete();
  }
}
