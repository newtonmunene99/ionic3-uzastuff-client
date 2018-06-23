import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { config } from './app.firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string; component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private imageLoaderConfig: ImageLoaderConfig,
    private storage: Storage
  ) {
    //INITIALIZES FIREBASE WITH THE APP
    firebase.initializeApp(config);
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase.firestore().settings({ timestampsInSnapshots: true });

    /* firebase
      .firestore()
      .enablePersistence()
      .catch(err => {
        console.error(err);
      }); */
    this.storage.get('user-uzastuff').then(user => {
      console.log('user' + user);
      if (user) {
        this.rootPage = 'TabsPage';
      } else {
        this.rootPage = 'LoginPage';
      }
    });
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage' },
      { title: 'Cart', component: 'CartPage' },
      { title: 'Saved', component: 'SavedPage' }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.overlaysWebView(true);
      this.splashScreen.hide();

      //CONFIGURATION FOR THE IMAGE LOADER PLUGIN
      this.imageLoaderConfig.enableDebugMode();
      //sets a fallback image as the placeholder while it loads, else defaults to a spinner
      this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
      //sets how long images will be cached
      this.imageLoaderConfig.setMaximumCacheAge(28 * 24 * 60 * 60 * 1000); // 28 days
      this.imageLoaderConfig.setConcurrency(10);
      //uses <img> tag
      this.imageLoaderConfig.useImageTag(true);
      //sets the name for the cache directory
      this.imageLoaderConfig.setCacheDirectoryName('UZASTUFFImgsCache');
      //sets size of the cache directory
      this.imageLoaderConfig.setMaximumCacheSize(50 * 1024 * 1024); //50MB
      //sets the fallback image to useS
      this.imageLoaderConfig.setFallbackUrl('./assets/imgs/fallback.png');
      this.imageLoaderConfig.enableSpinner(true);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
