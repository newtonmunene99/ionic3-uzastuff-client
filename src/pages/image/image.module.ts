import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImagePage } from './image';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [ImagePage],
  imports: [IonicPageModule.forChild(ImagePage), IonicImageLoader]
})
export class ImagePageModule {}
