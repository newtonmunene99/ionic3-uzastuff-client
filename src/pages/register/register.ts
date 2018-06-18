import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  name: any;
  username: any;
  email: any;
  password: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthProvider,
    public toastCtrl: ToastController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  registerWithEmail() {
    this.authService
      .registerWithEmail(this.email, this.password, this.name, this.username)
      .then(res => {
        if (res === true) {
          this.navCtrl.push('TabsPage');
        } else if (res === 'verify') {
          this.toastCtrl
            .create({
              message: 'Verify Your Account and Try Again',
              duration: 3000,
              position: 'top',
              cssClass: 'toast-fail'
            })
            .present();
          this.navCtrl.push('LoginPage');
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
