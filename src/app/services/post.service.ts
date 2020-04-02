import { Injectable } from '@angular/core';
import { of, forkJoin, combineLatest } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { switchMap, tap, distinct } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private firestore: AngularFirestore,
    private functions: AngularFireFunctions
  ) { }

  getPosts(sort: string = 'createdAt') {
    return this.firestore.collection('posts',
      ref => ref.orderBy(sort, 'desc').limit(20)
    ).valueChanges({ idField: 'id' });
  }

  getMorePosts(sort: string = 'recent', startAt: any) {
    return of([]);
  }

  getPostById(id: string) {
    return this.firestore.doc(`posts/${id}`).valueChanges();
  }

  getPostsByUserId(id: string) {
    return this.firestore.collection('posts',
      ref => ref.where('userId', '==', id).limit(10)
    ).valueChanges({ idField: 'id' });
  }

  getPostsBySearchTerm(term: string = '') {
    const searchTerm = term.toLowerCase().trim();
    if (!searchTerm) return of([]);
    const title$ = this.firestore.collection('posts',
      ref => ref.where('lowerCaseTitle', '>=', searchTerm).where('lowerCaseTitle', '<=', searchTerm + 'z')
    ).valueChanges({ idField: 'id' });

    const company$ = this.firestore.collection('posts',
      ref => ref.where('lowerCaseCompany', '>=', searchTerm).where('lowerCaseCompany', '<=', searchTerm + 'z')
    ).valueChanges({ idField: 'id' });

    return combineLatest([title$, company$])
      .pipe(
        switchMap(([titles, companys]) => {
          return of([...titles, ...companys]);
        }),
        distinct((post: any) => post.id)
      );
  }

  createPost(post: any) {
    return this.firestore.collection('posts').add(post);
  }

  deletePost(postId: string) {
    return this.firestore.doc(`posts/${postId}`).delete();
  }

  likePost(postId: string, userId: string) {
    return this.functions
      .httpsCallable('likePost')({ postId, userId })
      .toPromise();
  }

  unlikePost(postId: string, userId: string) {
    return this.functions
      .httpsCallable('unlikePost')({ postId, userId })
      .toPromise();
  }

  reportPost(postId: string, userId: string) {
    return;
  }
}
