import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    // TODO switch localstorage to Capacitor Storage Plugin
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode) document.body.classList.add('dark');

    const primaryColor = localStorage.getItem('primary-color');
    if (primaryColor) {
      const { hex, rgb, shade, tint } = JSON.parse(primaryColor);
      document.documentElement.style.setProperty('--ion-color-primary', hex);
      document.documentElement.style.setProperty('--ion-color-primary-rgb', rgb);
      document.documentElement.style.setProperty('--ion-color-primary-shade', shade);
      document.documentElement.style.setProperty('--ion-color-primary-tint', tint);
    }
  }
}
