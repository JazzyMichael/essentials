import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserPageRoutingModule } from './user-routing.module';

import { UserPage } from './user.page';
import { ColorPopoverComponent } from './color-popover/color-popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserPageRoutingModule
  ],
  declarations: [
    UserPage,
    ColorPopoverComponent
  ],
  entryComponents: [
    ColorPopoverComponent
  ]
})
export class UserPageModule {}
