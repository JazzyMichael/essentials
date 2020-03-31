import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ThumbnailListComponent } from './thumbnail-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ThumbnailListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [
    ThumbnailListComponent
  ]
})
export class ThumbnailListModule { }
