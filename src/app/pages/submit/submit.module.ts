import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubmitPageRoutingModule } from './submit-routing.module';

import { SubmitPage } from './submit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SubmitPageRoutingModule
  ],
  declarations: [SubmitPage]
})
export class SubmitPageModule {}
