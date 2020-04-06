import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('platform ready');
      /* TODO: set up capacitor plugins for native apps:
        - status bar
        - splash screen
      */
    });

    this.setDarkMode();
    this.setPrimaryColor();
  }

  setDarkMode() {
    Storage.get({ key: 'darkMode' })
      .then(({ value }) => {
        if (value) document.body.classList.add('dark');
      });
  }

  setPrimaryColor() {
    Storage.get({ key: 'primaryColor' })
      .then(({ value }) => {
        const primaryColor = value && JSON.parse(value);
        if (primaryColor) {
          const { hex, rgb, shade, tint } = primaryColor;
          document.documentElement.style.setProperty('--ion-color-primary', hex);
          document.documentElement.style.setProperty('--ion-color-primary-rgb', rgb);
          document.documentElement.style.setProperty('--ion-color-primary-shade', shade);
          document.documentElement.style.setProperty('--ion-color-primary-tint', tint);
        }
      });
  }
}
