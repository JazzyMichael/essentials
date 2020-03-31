import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPostsPage } from './user-posts.page';

const routes: Routes = [
  {
    path: '',
    component: UserPostsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPostsPageRoutingModule {}
