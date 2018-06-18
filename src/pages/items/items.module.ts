import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemsPage } from './items';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [ItemsPage],
  imports: [IonicPageModule.forChild(ItemsPage), IonicImageLoader]
})
export class ItemsPageModule {}
