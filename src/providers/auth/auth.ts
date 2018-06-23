import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  user: any;
  db = firebase.firestore();
  constructor(public http: HttpClient, private storage: Storage) {
    console.log('Hello AuthProvider Provider');
  }

  registerWithEmail(email, password, name, username) {
    return new Promise(resolve => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(response => {
          firebase
            .auth()
            .currentUser.sendEmailVerification()
            .then(res => {
              let userdata = JSON.parse(JSON.stringify(response));

              this.createUser(
                userdata.uid,
                name,
                username,
                'https://profile.actionsprout.com/default.jpeg'
              )
                .then(res => {
                  if (res === true) {
                    this.loginWithEmail(email, password)
                      .then(res => {
                        if (res === true) {
                          resolve(true);
                        } else if (res === 'verify') {
                          resolve('verify');
                        } else if (res === 'password') {
                          resolve('password');
                        } else {
                          resolve(false);
                        }
                      })
                      .catch(err => {
                        resolve(false);
                        console.error(err);
                      });
                  } else {
                    this.deleteAccount()
                      .then(res => {
                        resolve(false);
                      })
                      .catch(err => {
                        console.error(err);
                      });
                  }
                })
                .catch(err => {
                  console.error(err);
                  this.deleteAccount()
                    .then(res => {
                      resolve(false);
                    })
                    .catch(err => {
                      console.error(err);
                    });
                });
            })
            .catch(err => {
              console.error(err);
              this.deleteAccount()
                .then(res => {
                  resolve(false);
                })
                .catch(err => {
                  console.error(err);
                });
            });
        })
        .catch(err => {
          console.error(err);
          resolve('email');
        });
    });
  }

  loginWithEmail(email, password) {
    return new Promise(resolve => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(response => {
          let userdata = JSON.parse(JSON.stringify(response));
          console.log(userdata);
          if (userdata.user.emailVerified === true) {
            this.setLoginKey(userdata.user.uid)
              .then(res => {
                resolve(true);
              })
              .catch(err => {
                console.error(err);
                resolve(false);
              });
          } else {
            resolve('verify');
          }
        })
        .catch(err => {
          if (err.code === 'auth/wrong-password') {
            resolve('password');
          } else {
            console.error(err.code);
            resolve(false);
          }
        });
    });
  }

  createUser(uid, name, username, displaypic) {
    return new Promise(resolve => {
      firebase
        .auth()
        .currentUser.updateProfile({
          displayName: name,
          photoURL: displaypic
        })
        .then(res => {
          this.db
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .set({
              uid: firebase.auth().currentUser.uid,
              displayName: name,
              userName: username,
              profilephoto: displaypic
            })
            .then(res => {
              resolve(true);
            })
            .catch(err => {
              console.error(err);
              resolve(false);
            });
        })
        .catch(err => {
          console.error(err);
          resolve(false);
        });
    });
  }

  setLoginKey(uid) {
    return new Promise(resolve => {
      this.storage
        .set('user-uzastuff', uid)
        .then(res => {
          console.log(res);
          resolve(true);
        })
        .catch(err => {
          console.error(err);
          resolve(false);
        });
    });
  }

  logout() {
    return new Promise(resolve => {
      firebase
        .auth()
        .signOut()
        .catch(err => {
          console.error(err);
        })
        .then(res => {
          this.storage
            .remove('user-uzastuff')
            .then(() => {
              this.user = null;
              resolve(true);
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

  deleteAccount() {
    return new Promise(resolve => {
      firebase
        .auth()
        .currentUser.delete()
        .then(res => {
          resolve(true);
        })
        .catch(err => {
          resolve(false);
          console.error(err);
        });
    });
  }

  checkLoginStatus() {
    return new Promise(resolve => {
      if (this.user) {
        resolve(this.user);
      } else {
        this.storage
          .get('user-uzastuff')
          .then(user => {
            if (user) {
              this.user = user;
              resolve(user);
            } else {
              resolve(false);
            }
          })
          .catch(err => {
            console.error(err);
            resolve('error');
          });
      }
    });
  }
}
