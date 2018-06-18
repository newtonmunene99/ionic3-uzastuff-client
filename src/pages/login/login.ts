import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: any;
  password: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthProvider,
    public toastCtrl: ToastController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  loginWithEmail() {
    this.authService
      .loginWithEmail(this.email, this.password)
      .then(res => {
        if (res === true) {
          this.navCtrl.push('TabsPage');
        } else if (res === 'verify') {
          this.toastCtrl
            .create({
              message: 'Verify Account and Try Again',
              duration: 3000,
              position: 'top',
              cssClass: 'toast-fail'
            })
            .present();
        } else if (res === 'false') {
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
        console.error(err);
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
