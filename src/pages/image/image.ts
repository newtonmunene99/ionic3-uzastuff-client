import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import Vibrant from 'node-vibrant';

/**
 * Generated class for the ImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-image',
  templateUrl: 'image.html'
})
export class ImagePage {
  photos: any;
  color: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.photos = this.navParams.get('photos');
    this.getColor();
  }

  getColor() {
    Vibrant.from(this.photos[0].url)
      .getPalette()
      .then(palette => {
        console.log(palette.DarkMuted.getHex());
        //this.backcolor = palette.DarkMuted.getHex();
        //this.backcolor = palette.DarkVibrant.getHex();
        //this.backcolor = palette.LightMuted.getHex();
        //this.backcolor = palette.LightVibrant.getHex();
        // this.backcolor = palette.Muted.getHex();
        this.color = palette.Vibrant.getHex();
        console.log(this.color);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImagePage');
  }
}
