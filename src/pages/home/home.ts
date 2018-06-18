import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ItemsProvider } from '../../providers/items/items';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  categories: any;
  fakecategories: Array<any> = new Array(6);
  cart: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private itemService: ItemsProvider
  ) {
    this.getCategories();
    this.getCart();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  getCategories() {
    this.itemService.getCategories().subscribe(
      categories => {
        this.categories = categories;
      },
      err => {
        console.error(err);
      }
    );
  }

  getCart() {
    this.itemService.getCart().subscribe(
      (res: any) => {
        if (res === false) {
          this.cart = null;
        } else if (res === 'login') {
          this.cart = null;
        } else {
          this.cart = res;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  openItem() {
    this.navCtrl.push('ItemPage');
  }

  openCategory(category) {
    this.navCtrl.push('ItemsPage', { category: category });
  }

  openCart() {
    this.navCtrl.push('CartPage');
  }
}
