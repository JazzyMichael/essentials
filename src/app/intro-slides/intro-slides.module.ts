import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroSlidesPageRoutingModule } from './intro-slides-routing.module';

import { IntroSlidesPage } from './intro-slides.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntroSlidesPageRoutingModule
  ],
  declarations: [IntroSlidesPage]
})
export class IntroSlidesPageModule {}
