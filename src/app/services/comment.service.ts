import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private firestore: AngularFirestore) { }

  create(obj: any) {
    return this.firestore
      .collection(`posts/${obj.postId}/comments`)
      .add(obj);
  }

  getComments(postId: string) {
    return this.firestore
      .collection(`posts/${postId}/comments`)
      .valueChanges({ idField: 'id' });
  }

  getComment(postId: string, commentId: string) {
    return this.firestore
      .doc(`posts/${postId}/comments/${commentId}`)
      .valueChanges();
  }

  deleteComment(postId: string, commentId: string) {
    return this.firestore
      .doc(`posts/${postId}/comments/${commentId}`)
      .delete();
  }

  getReplies(postId: string, commentId: string) {
    return this.firestore
      .collection(`posts/${postId}/comments/${commentId}/replies`)
      .valueChanges({ idField: 'id' });
  }

  reply(postId: string, commentId: string, newReply: any) {
    return this.firestore
      .collection(`posts/${postId}/comments/${commentId}/replies`)
      .add(newReply);
  }
}
