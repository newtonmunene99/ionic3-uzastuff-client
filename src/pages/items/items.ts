import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ItemsProvider } from '../../providers/items/items';

/**
 * Generated class for the ItemsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-items',
  templateUrl: 'items.html'
})
export class ItemsPage {
  items: any;
  category: any = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private itemService: ItemsProvider
  ) {
    this.category = this.navParams.get('category');
    this.getItems();
  }

  getItems() {
    this.itemService.getItems(this.category.id).subscribe(
      items => {
        this.items = items;
      },
      err => {
        console.error(err);
      }
    );
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemsPage');
  }

  openItem(item) {
    this.navCtrl.push('ItemPage', { item: item, category: this.category.id });
  }
}
