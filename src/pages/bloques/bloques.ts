import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SilabasCastillano } from '../../silabas/silabas.castillano';

@Component({
  selector: 'bloques',
  templateUrl: 'bloques.html'
})
export class Bloques {

  woohoo:boolean = false;
  silabasAlAzar:string[];

  constructor(
    public navCtrl: NavController,
    public castillano: SilabasCastillano
  ) {
    this.nuevosBloques();
  }

  nuevosBloques(){
    this.woohoo = false;
    this.silabasAlAzar = this.shuffle(this.castillano.listaSilabas);
    //take(8)
  }

  shuffle(array)
  {
    var m = array.length, t, i;
    while (m > 0) 
    {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    }
    return array;
  }

  esPalabra(eleccion1:string, eleccion2:string):boolean {
    // console.log(eleccion);
    return false;
  }

}
