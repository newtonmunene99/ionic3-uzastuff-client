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
  paymentmethod: any;

  card: any = {
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    name: '',
    currency: 'KES'
  };
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

  fillInCard() {
    let alert = this.alertCtrl.create({
      title: 'Add Card Details',
      subTitle: 'Please Add Exactly as Written on Card',
      cssClass: 'cardDetailsPrompt',
      inputs: [
        {
          name: 'cardnumber',
          placeholder: 'Enter Card Number'
        },
        {
          name: 'expMonth',
          placeholder: 'Enter Card Expiry Month'
        },
        {
          name: 'expYear',
          placeholder: 'Enter Card Expiry Year'
        },
        {
          name: 'cvc',
          placeholder: 'Enter Card CVC/CVV'
        },
        {
          name: 'name',
          placeholder: 'Enter Card Holder Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            this.card.number = data.cardnumber;
            this.card.expMonth = data.expMonth;
            this.card.expYear = data.expYear;
            this.card.cvc = data.cvc;
            this.card.name = data.name;
            console.log(this.card);
          }
        }
      ]
    });
    alert.present();
  }

  scanCard() {
    this.paymentService
      .scanCard()
      .then((res: any) => {
        if (res === false) {
          this.toastCtrl
            .create({
              message: 'Your Device Does Not Support Card Scanning.',
              duration: 3000,
              position: 'top',
              cssClass: 'toast-fail'
            })
            .present();
        } else if (res === 'error') {
          this.toastCtrl
            .create({
              message: 'There Was An Error Scanning Card. Try Again',
              duration: 3000,
              position: 'top',
              cssClass: 'toast-fail'
            })
            .present();
        } else {
          this.card.number = res.cardNumber;
          this.card.expMonth = res.expiryMonth;
          this.card.expYear = res.expiryYear;
          this.card.cvc = res.cvv;
          this.card.name = res.carddholderName;
          console.log(this.card);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  usePayPal() {
    this.paymentService
      .usePaypal()
      .then(res => {
        console.log(res);
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

  processWithStripe() {
    this.paymentService
      .processWithStripe(this.card)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
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
}
