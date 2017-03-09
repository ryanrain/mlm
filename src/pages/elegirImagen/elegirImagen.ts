import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Castillano } from '../../alfabetos/castillano';
import { LetraModel } from '../../models/letra.model';

@Component({
  selector: 'page-elegir-imagen',
  templateUrl: 'elegirImagen.html'
})
export class ElegirImagen {

  letraAhora:string;
  alfabetoAlAzar:LetraModel[] = [];
  opciones:LetraModel[] = [];
  // alfabeto:AlfabetoModel[];

  constructor(
    public navCtrl: NavController,
    public castillano: Castillano
  ) {
    this.nuevaLetra(this.castillano.alfabeto);
  }

  nuevaLetra(alfabeto){
    this.alfabetoAlAzar = this.shuffle(alfabeto);
    this.letraAhora = this.alfabetoAlAzar[0].letra;

    this.opciones = this.shuffle([
      this.alfabetoAlAzar[0].letra, 
      this.alfabetoAlAzar[1].letra, 
      this.alfabetoAlAzar[2].letra
    ]);
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

  aVer(eleccion:string){
    console.log(eleccion);
    if (eleccion === this.letraAhora) {
      this.nuevaLetra(this.castillano.alfabeto);
    }
  }


}
