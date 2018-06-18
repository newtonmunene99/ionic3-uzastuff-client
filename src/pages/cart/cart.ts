import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { ItemsProvider } from '../../providers/items/items';

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
  cart: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private itemService: ItemsProvider,
    public toastCtrl: ToastController
  ) {
    this.getCart();
  }

  getCart() {
    this.itemService.getCart().subscribe(
      res => {
        if (res === false) {
        } else if (res === 'login') {
        } else {
          this.cart = res;
          console.log(res);
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  increaseQuantity(item) {
    let quantity = item.quantity;
    quantity = item.quantity + 1;
    this.itemService.changeCartItemQuantity(item, quantity);
  }

  decreaseQuantity(item) {
    let quantity = item.quantity;
    if (quantity === 1) {
      console.log('endoflineboy');
    } else {
      quantity = item.quantity - 1;
    }
    this.itemService.changeCartItemQuantity(item, quantity);
  }

  removeItem(item) {
    this.itemService
      .removeFromCart(item)
      .then(res => {
        if (res === true) {
          this.toastCtrl
            .create({
              message: '' + item.name + ' removed from Cart',
              duration: 3000,
              position: 'top',
              cssClass: 'toast-success'
            })
            .present();
        } else if (res === 'login') {
          this.toastCtrl
            .create({
              message: 'You Need To Be Logged In',
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

  openItem(item) {
    this.navCtrl.push('ItemPage', {
      item: item,
      category: item.categoryid
    });
  }

  checkout() {
    this.navCtrl.push('CheckoutPage');
  }
}
