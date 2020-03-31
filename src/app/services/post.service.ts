import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor() { }

  getPosts(sort: string = 'recent') {
    return of(new Array(5));
  }

  getMorePosts(sort: string = 'recent', startAt: any) {
    return of(new Array(11));
  }

  getPostsByUserId(id: string) {
    return of(new Array(2));
  }

  getPostsBySearchTerm(term: string = '') {
    return term.length ? of(new Array(9)) : of([]);
  }

  createPost(post: any) {
    console.log('createPost', post);
    return;
  }

  deletePost(postId: string) {
    return;
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
