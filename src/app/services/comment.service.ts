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
}
