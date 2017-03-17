import { Component, ViewChildren, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import { NavController } from 'ionic-angular';

import { AlfabetoCastillano } from '../../alfabetos/alfabeto.castillano';
import { LetraModel } from '../../models/letra.model';

@Component({
  selector: 'page-elegir-imagen',
  templateUrl: 'elegirImagen.html'
})
export class ElegirImagen implements AfterViewInit {

  letraAhora:string;
  alfabetoAlAzar:LetraModel[] = [];
  opciones:LetraModel[] = [];
  woohoo:boolean = false;
  intentos:Observable<any>;
  @ViewChildren('opcion1,opcion2,opcion3') opcionesBotones:QueryList<ElementRef>;

  constructor(
    public navCtrl: NavController,
    public castillano: AlfabetoCastillano,
    ) {
    this.nuevaLetra(this.castillano.alfabeto);
  }

  ngAfterViewInit() {

    // loop through QueryList and return a single Observable of events
    this.opcionesBotones.reduce( (acc, boton) => {
        let current = Observable.fromEvent(boton.nativeElement, 'click');
        if ( acc === null) {
          // console.log('first run');
          return current;
        } 
        // console.log('subsequent');
        this.intentos = acc.merge(current);
        return this.intentos;
      },
      null
    );

    // act on button clicks
    this.intentos
      .map(clickEvent => {
        console.log(clickEvent);
        return clickEvent.target;
      })
      .subscribe(boton => {
        console.log(boton);
        if( this.aVer(boton.innerHTML) ) {
          this.celebrar(boton);
          setTimeout(
            function(){
              this.quitarWoohoo();
              this.nuevaLetra(this.castillano.alfabeto);
            }.bind(this),
            1000
          );
        }
      })
    ;
  }
  
  // check if correct
  aVer(eleccion:string){
    if (eleccion === this.letraAhora) {
      return true
    } else { 
      return false
    }
  }

  celebrar(boton){
    boton.classList.add('woohoo');
    console.log('algo visual, escuchar ching');
    // this.woohoo = true;
  }

  subirImagen(){
    // animacion sube el imagen, achica la letra

  }

  escucharLetra(letra:string) {
  // escuchar audioPalabra

  }

  escucharPalabra(letra:string) {
  // escuchar audioPalabra

  }

  mostrarPalabra (letra:string) {
    // aparece escrito la palabra
    this.escucharPalabra(letra);
  }

  quitarWoohoo() {
    this.opcionesBotones.forEach(boton => {
      boton.nativeElement.classList.remove('woohoo');
    })
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


  volver() {
    this.navCtrl.pop();
  }

}
