import { Injectable } from '@angular/core';
import {
  PayPal,
  PayPalPayment,
  PayPalConfiguration
} from '@ionic-native/paypal';

/*
  Generated class for the PaymentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PaymentProvider {
  constructor(private paypal: PayPal) {}

  usePaypal(amount) {
    return new Promise(resolve => {
      this.paypal
        .init({
          PayPalEnvironmentProduction:
            'AWcaekkYB_Iy6s4IPh3Qv5P_RGFBndaQyKSPIWljPffN3u1n-5vDx5I9v-4oCJs7PAFUFXc-FGsR-mB1',
          PayPalEnvironmentSandbox:
            'AS07soWhPCOJQFB_oNHxuQmcLYC2jv0IyMCosJRRC10kLWPUg1hpK4u26D-a3cEmUbRXjgScSSmBkfUM'
        })
        .then(
          () => {
            // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
            this.paypal
              .prepareToRender(
                'PayPalEnvironmentSandbox',
                new PayPalConfiguration({
                  rememberUser: true,
                  merchantPrivacyPolicyURL:
                    'https://enteryourprivacypolicyurlhere.com',
                  merchantUserAgreementURL:
                    'https://enteryouruseragreementurlhere.com',
                  merchantName: 'Uzastuff Online Shop',
                  acceptCreditCards: true
                  // Uncomment the line below if you get an "Internal Service Error" after PayPal login!
                  //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
                })
              )
              .then(
                () => {
                  let payment = new PayPalPayment(
                    amount,
                    'USD',
                    'UzaStuff Order Payment',
                    'Item Sale'
                  );
                  this.paypal.renderSinglePaymentUI(payment).then(
                    res => {
                      console.log(res);
                      resolve(res);
                    },
                    err => {
                      // Error or render dialog closed without being successful
                      resolve(false);
                      console.error(err);
                    }
                  );
                },
                err => {
                  resolve(false);
                  // Error in configuration
                  console.error(err);
                }
              );
          },
          err => {
            resolve(false);
            // Error in initialization, maybe PayPal isn't supported or something else
            console.error(err);
          }
        );
    });
  }
}
