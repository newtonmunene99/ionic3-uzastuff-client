import { Component, ViewChild } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { ItemsProvider } from '../../providers/items/items';

/**
 * Generated class for the ItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-item',
  templateUrl: 'item.html'
})
export class ItemPage {
  @ViewChild('imageSlider') imageSlider: any;
  itemid: any;
  cid: any;
  item: any = {};
  fakecards: Array<any> = new Array(5);
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private itemService: ItemsProvider,
    public toastCtrl: ToastController
  ) {
    this.itemid = this.navParams.get('item').id;
    this.cid = this.navParams.get('category');
    this.getItemDetails();
  }

  openImage(photos) {
    this.navCtrl.push('ImagePage', { photos: photos });
  }

  slideImage(index) {
    this.imageSlider.slideTo(index);
  }

  getItemDetails() {
    this.itemService
      .getItemDetails(this.cid, this.itemid)
      .subscribe(details => {
        this.item = details;
        console.log(details);
      });
  }

  addToCart() {
    this.itemService
      .addToCart(this.item, this.cid)
      .then(res => {
        if (res === true) {
          this.toastCtrl
            .create({
              message: '' + this.item + ' Added To Cart',
              duration: 3000,
              position: 'top',
              cssClass: 'toast-success'
            })
            .present();
        } else if (res === 'added') {
          this.toastCtrl
            .create({
              message: '' + this.item + ' is already in your Cart',
              duration: 3000,
              position: 'top',
              cssClass: 'toast-fail'
            })
            .present();
        } else {
          this.toastCtrl
            .create({
              message: 'There Was An Error, Please Try Again',
              duration: 3000,
              position: 'top',
              cssClass: 'toast-fail'
            })
            .present();
        }
      })
      .catch(err => {
        console.log(err);
        this.toastCtrl
          .create({
            message: 'There Was An Error, Please Try Again',
            duration: 3000,
            position: 'top',
            cssClass: 'toast-fail'
          })
          .present();
      });
  }

  addToWishlist() {
    this.itemService
      .addToWishlist(this.item)
      .then(res => {
        if (res === true) {
          this.toastCtrl
            .create({
              message: '' + this.item + ' Added To Wishlist',
              duration: 3000,
              position: 'top',
              cssClass: 'toast-success'
            })
            .present();
        } else if (res === 'added') {
          this.toastCtrl
            .create({
              message: '' + this.item + ' Already In Wishlist',
              duration: 3000,
              position: 'top',
              cssClass: 'toast-fail'
            })
            .present();
        } else {
          this.toastCtrl
            .create({
              message: 'There was an Error, Please Try Again',
              duration: 3000,
              position: 'top',
              cssClass: 'toast-fail'
            })
            .present();
        }
      })
      .catch(err => {
        this.toastCtrl
          .create({
            message: 'There was an Error, Please Try Again',
            duration: 3000,
            position: 'top',
            cssClass: 'toast-fail'
          })
          .present();
      });
  }
}
