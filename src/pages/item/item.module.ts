import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemPage } from './item';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [ItemPage],
  imports: [IonicPageModule.forChild(ItemPage), IonicImageLoader]
})
export class ItemPageModule {}
