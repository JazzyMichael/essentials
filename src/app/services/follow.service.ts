import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(private functions: AngularFireFunctions) { }

  addFollower(doc: string, newId: string, oldId?: string) {
    return this.functions
      .httpsCallable('addFollower')({ doc, newId, oldId })
      .toPromise();
  }

  removeFollower(doc: string, id: string) {
    return this.functions
      .httpsCallable('removeFollower')({ doc, id })
      .toPromise();
  }
}
