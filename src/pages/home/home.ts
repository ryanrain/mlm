import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ElegirImagen } from '../elegirImagen/elegirImagen';
import { Bloques } from '../bloques/bloques';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  pages: any[] = [
    { title: 'Elegir Imagen', component: ElegirImagen },
    { title: 'Bloques', component: Bloques }
  ]

  constructor(public navCtrl: NavController) {
    
  }

  openPage(page) {
    this.navCtrl.push(page.component);
  }

}
