import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommentViewPageRoutingModule } from './comment-view-routing.module';

import { CommentViewPage } from './comment-view.page';
import { RepliesComponent } from './replies/replies.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommentViewPageRoutingModule
  ],
  declarations: [
    CommentViewPage,
    RepliesComponent
  ]
})
export class CommentViewPageModule {}
