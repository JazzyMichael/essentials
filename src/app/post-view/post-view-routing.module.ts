import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostViewPage } from './post-view.page';

const routes: Routes = [
  {
    path: '',
    component: PostViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostViewPageRoutingModule {}
