import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private firestore: AngularFirestore) { }

  add(report: any) {
    return this.firestore.collection('reports').add(report);
  }
}
