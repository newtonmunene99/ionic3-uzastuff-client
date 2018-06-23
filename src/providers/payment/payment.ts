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
                  // Only needed if you get an "Internal Service Error" after PayPal login!
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
                      // Successfully paid
                      // Example sandbox response
                      //
                      // {
                      //   "client": {
                      //     "environment": "sandbox",
                      //     "product_name": "PayPal iOS SDK",
                      //     "paypal_sdk_version": "2.16.0",
                      //     "platform": "iOS"
                      //   },
                      //   "response_type": "payment",
                      //   "response": {
                      //     "id": "PAY-1AB23456CD789012EF34GHIJ",
                      //     "state": "approved",
                      //     "create_time": "2016-10-03T13:33:33Z",
                      //     "intent": "sale"
                      //   }
                      // }
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
