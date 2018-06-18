import { Injectable } from '@angular/core';
import { CardIO } from '@ionic-native/card-io';
import { Stripe } from '@ionic-native/stripe';
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
  constructor(
    private cardio: CardIO,
    private stripe: Stripe,
    private paypal: PayPal
  ) {
    console.log('Hello PaymentProvider Provider');
  }

  scanCard() {
    return new Promise(resolve => {
      this.cardio
        .canScan()
        .then((res: boolean) => {
          if (res) {
            let options = {
              requireExpiry: false,
              requireCVV: false,
              requirePostalCode: false,
              scanInstructions: 'Please Make Sure The Image Is Clear',
              hideCardIOLogo: true
            };
            this.cardio
              .scan(options)
              .then(card => {
                resolve(card);
                console.log(card);
              })
              .catch(err => {
                resolve('error');
                console.log(err);
              });
          } else {
            console.log('Your Device does not support this.');
            resolve(false);
          }
        })
        .catch(err => {
          console.error(err);
        });
    });
  }

  usePaypal() {
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
                    '3.33',
                    'USD',
                    'Description',
                    'sale'
                  );
                  this.paypal.renderSinglePaymentUI(payment).then(
                    () => {
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
                    () => {
                      // Error or render dialog closed without being successful
                    }
                  );
                },
                () => {
                  // Error in configuration
                }
              );
          },
          () => {
            // Error in initialization, maybe PayPal isn't supported or something else
          }
        );
    });
  }

  processWithStripe(card) {
    return new Promise(resolve => {
      this.stripe.setPublishableKey('pk_test_RokjluLPLnnNMvpvvUYzIn9n');
      this.stripe
        .validateCardNumber(card.number)
        .then(res => {
          console.log(res);
          this.stripe
            .validateCVC(card.cvc)
            .then(res => {
              console.log(res);
              this.stripe
                .validateExpiryDate(card.expMonth, card.expYear)
                .then(res => {
                  console.log(res);
                  this.stripe
                    .createCardToken(card)
                    .then(token => console.log(token.id))
                    .catch(error => console.error(error));
                })
                .catch(err => {
                  console.error(err);
                });
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(err => {
          console.error(err);
        });
    });
  }
}
