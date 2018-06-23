import { Component, ViewChild } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  AlertController,
  Slides
} from 'ionic-angular';
import { ItemsProvider } from '../../providers/items/items';
import { PaymentProvider } from '../../providers/payment/payment';

/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html'
})
export class CheckoutPage {
  @ViewChild('checkoutSlider') checkoutSlider: Slides;
  items: any;
  total: number = 0;
  procurement: any;
  payment: any;
  name: any;
  email: any;
  phone: any;
  address: any;
  paid: boolean = false;
  paymentdetails: any;
  paymentmethod: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private itemService: ItemsProvider,
    protected paymentService: PaymentProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController
  ) {
    this.getItems();
  }

  slideChanged() {
    let currentIndex: number = this.checkoutSlider.getActiveIndex();
    console.log(currentIndex);
  }

  next() {
    this.checkoutSlider.slideNext();
  }

  previous() {
    this.checkoutSlider.slidePrev();
  }

  getItems() {
    this.itemService.getCart().subscribe(
      res => {
        if (res === false) {
        } else if (res === 'login') {
        } else {
          this.items = res;
          for (let item of this.items) {
            let price = item.price * item.quantity;
            this.total = this.total + price;
          }
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  usePayPal() {
    this.paymentService
      .usePaypal(this.total)
      .then(res => {
        if (res === false) {
        } else {
          console.log(res);
          this.paid = true;
          this.paymentdetails = res;
        }
      })
      .catch(err => {
        console.error(err);
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

  saveOrder() {
    this.itemService
      .saveOrder(
        this.name,
        this.email,
        this.phone,
        this.address,
        this.paymentmethod,
        this.paid,
        this.paymentdetails || 'Not Paid',
        this.total,
        this.procurement,
        this.items
      )
      .then(res => {
        if (res === true) {
        } else {
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
}
