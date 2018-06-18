import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import moment from 'moment';
import { AuthProvider } from '../auth/auth';

/*
  Generated class for the ItemsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ItemsProvider {
  db = firebase.firestore();
  cart: any;
  categories: any;
  constructor(private authService: AuthProvider) {
    console.log('Hello ItemsProvider Provider');
  }

  getCategories() {
    return new Observable(observer => {
      if (this.categories) {
        observer.next(this.categories);
      } else {
        this.db.collection('categories').onSnapshot(
          res => {
            this.categories = res.docs.map(doc => doc.data());
            observer.next(this.categories);
          },
          err => {
            observer.next(false);
            console.log(err);
          }
        );
      }
    });
  }

  getItems(categoryid) {
    return new Observable(observer => {
      this.db
        .collection('categories')
        .doc(categoryid)
        .collection('items')
        .onSnapshot(
          res => {
            observer.next(res.docs.map(doc => doc.data()));
          },
          err => {
            observer.next(false);
            console.log(err);
          }
        );
    });
  }

  getItemDetails(categoryid, itemid) {
    return new Observable(observer => {
      this.db
        .collection('categories')
        .doc(categoryid)
        .collection('items')
        .doc(itemid)
        .onSnapshot(
          doc => {
            observer.next(doc.data());
          },
          err => {
            observer.next(false);
            console.error(err);
          }
        );
    });
  }

  getCart() {
    return new Observable(observer => {
      this.authService
        .checkLoginStatus()
        .then((user: any) => {
          if (user === false) {
            observer.next('login');
          } else {
            this.db
              .collection('users')
              .doc(user)
              .collection('cart')
              .onSnapshot(
                res => {
                  this.cart = res.docs.map(doc => doc.data());
                  observer.next(this.cart);
                },
                err => {
                  observer.next(false);
                  console.log(err);
                }
              );
          }
        })
        .catch(err => {
          console.error(err);
          observer.next(false);
        });
    });
  }

  addToCart(item, cid) {
    return new Promise(resolve => {
      this.authService
        .checkLoginStatus()
        .then((user: any) => {
          if (user === false) {
            resolve('login');
          } else {
            this.db
              .collection('users')
              .doc(user)
              .collection('cart')
              .doc(item.id)
              .get()
              .then(doc => {
                if (doc.exists) {
                  resolve('added');
                } else {
                  this.db
                    .collection('users')
                    .doc(user)
                    .collection('cart')
                    .doc(item.id)
                    .set({
                      id: item.id,
                      quantity: 1,
                      addedon: moment().format('MMMM Do YYYY, h:mm:ss a'),
                      name: item.name,
                      price: item.price,
                      category: item.category,
                      categoryid: cid,
                      photos: item.photos
                    })
                    .then(res => {
                      resolve(true);
                    })
                    .catch(err => {
                      console.error(err);
                      resolve(false);
                    });
                }
              })
              .catch(err => {
                console.error(err);
                resolve(false);
              });
          }
        })
        .catch(err => {
          console.error(err);
          resolve(false);
        });
    });
  }

  removeFromCart(item) {
    return new Promise(resolve => {
      this.authService
        .checkLoginStatus()
        .then((user: any) => {
          if (user === false) {
            resolve('login');
          } else {
            this.db
              .collection('users')
              .doc(user)
              .collection('cart')
              .doc(item.id)
              .delete()
              .then(res => {
                resolve(true);
              })
              .catch(err => {
                console.error(err);
                resolve(false);
              });
          }
        })
        .catch(err => {
          console.error(err);
          resolve(false);
        });
    });
  }

  changeCartItemQuantity(item, quantity) {
    return new Promise(resolve => {
      this.authService
        .checkLoginStatus()
        .then((user: any) => {
          this.db
            .collection('users')
            .doc(user)
            .collection('cart')
            .doc(item.id)
            .update({ quantity: quantity })
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch();
    });
  }

  addToWishlist(item) {
    return new Promise(resolve => {
      this.authService
        .checkLoginStatus()
        .then((user: any) => {
          if (user === false) {
            resolve('login');
          } else {
            this.db
              .collection('users')
              .doc(user)
              .collection('wishlist')
              .doc(item.id)
              .get()
              .then(doc => {
                if (doc.exists) {
                  resolve('added');
                } else {
                  this.db
                    .collection('users')
                    .doc(user)
                    .collection('wishlist')
                    .doc(item.id)
                    .set({
                      id: item.id,
                      quantity: 1,
                      addedon: moment().format('MMMM Do YYYY, h:mm:ss a'),
                      name: item.name,
                      price: item.price,
                      category: item.category,
                      photos: item.photos
                    })
                    .then(res => {
                      resolve(true);
                    })
                    .catch(err => {
                      console.error(err);
                      resolve(false);
                    });
                }
              })
              .catch(err => {
                console.error(err);
                resolve(false);
              });
          }
        })
        .catch(err => {
          console.error(err);
          resolve(false);
        });
    });
  }

  removeFromWishlist(item) {
    return new Promise(resolve => {
      this.authService
        .checkLoginStatus()
        .then((user: any) => {
          if (user === false) {
            resolve('login');
          } else {
            this.db
              .collection('users')
              .doc(user)
              .collection('wishlist')
              .doc(item.id)
              .delete()
              .then(res => {
                resolve(true);
              })
              .catch(err => {
                console.error(err);
                resolve(false);
              });
          }
        })
        .catch(err => {
          console.error(err);
          resolve(false);
        });
    });
  }
}
