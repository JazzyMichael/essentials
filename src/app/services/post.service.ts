import { Injectable } from '@angular/core';
import { of, forkJoin } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private firestore: AngularFirestore) { }

  getPosts(sort: string = 'recent') {
    return this.firestore.collection('posts',
      ref => ref.orderBy('createdAt').limit(10)
    ).valueChanges({ idField: 'id' });
  }

  getMorePosts(sort: string = 'recent', startAt: any) {
    return of([]);
  }

  getPostsByUserId(id: string) {
    return this.firestore.collection('posts',
      ref => ref.where('userId', '==', id).limit(10)
    ).valueChanges({ idField: 'id' });
  }

  getPostsBySearchTerm(term: string = '') {
    // return term.length ? of(new Array(9)) : of([]);
    const searchTerm = term.toLowerCase().trim();
    const title$ = this.firestore.collection('posts',
      ref => ref.where('lowerCaseTitle', '>=', searchTerm).where('lowerCaseTitle', '<=', searchTerm + 'z')
    ).valueChanges({ idField: 'id' });

    return title$;

    // const type$ = this.firestore.collection('posts',
    //   ref => ref.where('lowerCaseType', '>=', term + 'z').orderBy('createdAt').limit(10)
    // );

    // const company$ = this.firestore.collection('posts',
    //   ref => ref.where('lowerCaseCompany', '>=', term + 'z').orderBy('createdAt').limit(10)
    // );

    // return forkJoin([title$, type$, company$])
    //   .pipe(
    //     switchMap(() => {
    //       // remove duplicates
    //     }),
    //     switchMap(() => {
    //       // flatten arrays
    //     })
    //   );
  }

  createPost(post: any) {
    return this.firestore.collection('posts').add(post);
  }

  deletePost(postId: string) {
    return this.firestore.doc(`posts/${postId}`).delete();
  }

  likePost(postId: string, userId: string) {
    return;
  }

  unlikePost(postId: string, userId: string) {
    return;
  }

  reportPost(postId: string, userId: string) {
    return;
  }
}
