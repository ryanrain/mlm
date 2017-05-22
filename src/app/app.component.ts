import { Component } from '@angular/core';

import { HomePage } from '../pages/home/home';

// import * as screenfull from 'screenfull';

@Component({
  template: `
    <ion-nav [root]="rootPage"></ion-nav>
  `
})
export class MyApp {
  rootPage = HomePage;

  constructor() {
  }

  // ngAfterViewInit() {
  //   if (screenfull.enabled) {
	// 		screenfull.toggle();
  //     console.log('screenfulled');
	// 	}
  // }
}
