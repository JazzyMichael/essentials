import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommentViewPage } from './comment-view.page';

const routes: Routes = [
  {
    path: ':postId/:commentId',
    component: CommentViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommentViewPageRoutingModule {}
