import { Injectable } from '@angular/core';
import { of, forkJoin, combineLatest } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { switchMap, tap, distinct, map } from 'rxjs/operators';

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
      ref => ref.orderBy(sort, 'desc').limit(4)
    ).valueChanges({ idField: 'id' });
  }

  getFirst(sort: string) {
    return this.firestore.collection('posts',
    ref => ref.orderBy(sort, 'desc').limit(4)
  ).get().pipe(map(snapshots => {
    const arr = [];
    snapshots.forEach(doc => {
      arr.push({ id: doc.id, ...doc.data() });
    });
    return arr;
  })).toPromise();
  }

  getMore(sort: string, last: any) {
    return this.firestore.collection('posts',
      ref => ref.orderBy(sort, 'desc').startAfter(last[sort]).limit(4)
    ).get().pipe(map(snapshots => {
      const arr = [];
      snapshots.forEach(doc => {
        arr.push({ id: doc.id, ...doc.data() });
      });
      return arr;
    })).toPromise();
  }

  getMorePosts(sort: string = 'createdAt', lastPost: any) {
    console.log('service', sort, lastPost);
    return this.firestore.collection('posts',
      ref => ref.orderBy(sort).startAfter(lastPost[sort]).limit(4)
    ).valueChanges({ idField: 'id' });
  }

  getPostById(id: string) {
    return this.firestore.doc(`posts/${id}`).valueChanges();
  }

  getPostsByUserId(id: string) {
    return this.firestore.collection('posts',
      ref => ref.where('userId', '==', id).limit(40)
    ).valueChanges({ idField: 'id' });
  }

  getPostsBySearchTerm(term: string = '') {
    const searchTerm = term.toLowerCase().trim();
    if (!searchTerm) return of([]);
    const title$ = this.firestore.collection('posts',
      ref => ref
        .where('lowerCaseTitle', '>=', searchTerm)
        .where('lowerCaseTitle', '<=', searchTerm + 'z')
        .limit(40)
    ).valueChanges({ idField: 'id' });

    const company$ = this.firestore.collection('posts',
      ref => ref
        .where('lowerCaseCompany', '>=', searchTerm)
        .where('lowerCaseCompany', '<=', searchTerm + 'z')
        .limit(40)
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
