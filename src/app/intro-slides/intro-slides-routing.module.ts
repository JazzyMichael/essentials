import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroSlidesPage } from './intro-slides.page';

const routes: Routes = [
  {
    path: '',
    component: IntroSlidesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntroSlidesPageRoutingModule {}
