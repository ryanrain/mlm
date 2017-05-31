import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Deploy } from '@ionic/cloud-angular';

import { HomePage } from '../pages/home/home';

// import * as screenfull from 'screenfull';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HomePage;

  constructor(public platform: Platform, public deploy: Deploy) {
    if (platform.is('cordova')) {
      this.deploy.check().then((snapshotAvailable: boolean) => {
        if (snapshotAvailable) {
          this.deploy.download().then(() => {
            return this.deploy.extract();
          });
        }
      });
    }
  }

  // ngAfterViewInit() {
  //   if (screenfull.enabled) {
	// 		screenfull.toggle();
  //     console.log('screenfulled');
	// 	}
  // }
}
