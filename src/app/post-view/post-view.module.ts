import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostViewPageRoutingModule } from './post-view-routing.module';

import { PostViewPage } from './post-view.page';
import { CommentsComponent } from './comments/comments.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostViewPageRoutingModule
  ],
  declarations: [
    PostViewPage,
    CommentsComponent
  ]
})
export class PostViewPageModule {}
