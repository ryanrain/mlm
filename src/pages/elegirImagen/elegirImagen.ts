import { Component, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/throttleTime';

import { NavController } from 'ionic-angular';

import { AlfabetoCastillano } from '../../alfabetos/alfabeto.castillano';
import { LetraModel } from '../../models/letra.model';

@Component({
  selector: 'page-elegir-imagen',
  // templateUrl: 'elegirImagen.html'
  template: `
  <button class="volver" (click)="volver()"><ion-icon name="home"></ion-icon></button>

  <ion-content padding [class.arriba]="imagenArriba">
    <div #letraAhoraRef id="letra-principal">
      <div>
        <span *ngIf="palabraAhora == ''">{{letraAhora}}</span>
        {{palabraAhora}}
      </div>
    </div>
    <div id="imagenes-letra">
      <img #opcion1 src="assets/imagenes/{{opciones[0].palabra}}.png" [id]="opciones[0].letra" [class]="opciones[0].palabra">
      <img #opcion2 src="assets/imagenes/{{opciones[1].palabra}}.png" [id]="opciones[1].letra" [class]="opciones[1].palabra">
      <img #opcion3 src="assets/imagenes/{{opciones[2].palabra}}.png" [id]="opciones[2].letra" [class]="opciones[2].palabra">
    </div>
  </ion-content>
  `
})
export class ElegirImagen implements AfterViewInit {

  letraAhora:string;
  palabraAhora:string = '';
  alfabetoAlAzar:LetraModel[] = [];
  opciones:LetraModel[] = [];
  imagenArriba:boolean = false;
  intentos:Observable<any>;
  letraClicks:Observable<any>;
  audioChing = new Audio('/assets/ching.mp3');
  audioLetraAhora = new Audio;
  audioOpciones = {};

  @ViewChildren('opcion1,opcion2,opcion3') opcionesBotones:QueryList<ElementRef>;
  @ViewChild('letraAhoraRef') letraAhoraRef:ElementRef;

  constructor(
    public navCtrl: NavController,
    public castillano: AlfabetoCastillano,
    ) {
    this.nuevaLetra(this.castillano.alfabeto);
  }

  ngAfterViewInit() {
    // que un 'click' en la letra haga sonar el audio de la letra
    this.audioLetraAhora.src = 'assets/letra_sonidos/' + this.letraAhora + '.MP3';
    this.letraClicks = Observable.fromEvent(this.letraAhoraRef.nativeElement, 'click');
    this.letraClicks
      .throttleTime(1000)
      .subscribe(clickEvent => {
        this.audioLetraAhora.play();
      });

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
      // new Observable<any>()
      null
    );

    // act on button clicks
    this.intentos
      .throttleTime(1000)    
      .subscribe(clickEvent => {
        // console.log(clickEvent);

        let letra = clickEvent.target.id;
        let palabra = clickEvent.target.classList[0];
        this.escuchar(palabra);

        if( letra === this.letraAhora ) {
          // note these setTimeout execute 
          let delay1 = 500,
              delay2 = delay1 + 1500,
              delay3 = delay2 + 1500,
              delay4 = delay3 + 1500;

          setTimeout(
            function(){
              this.celebrar(clickEvent.target);
              this.subirImagen();
            }.bind(this),
            delay1
          );
          setTimeout(
            function(){
              this.escuchar(letra);
            }.bind(this),
            delay2
          );
          setTimeout(
            function(){
              this.mostrarPalabra(palabra);
              this.escuchar(palabra);
            }.bind(this),
            delay3
          );
          setTimeout(
            function(){
              this.reset();
              this.nuevaLetra(this.castillano.alfabeto);
            }.bind(this),
            delay4
          );
        }
      })
    ;
  }
  
  celebrar(boton){
    boton.classList.add('woohoo');
    this.audioChing.play();    
  }

  subirImagen(){
    this.imagenArriba = true;
    // animacion sube el imagen, achica la letra
  }

  escuchar(letraOPalabra:string) {
    this.audioOpciones[letraOPalabra].play();    
  }

  mostrarPalabra (palabra:string) {
    // aparece escrito la palabra
    this.palabraAhora = palabra;
  }

  reset() {
    this.palabraAhora = '';
    this.imagenArriba = false;
    this.opcionesBotones.forEach(boton => {
      boton.nativeElement.classList.remove('woohoo');
    })
  }

  nuevaLetra(alfabeto){
    this.alfabetoAlAzar = this.shuffle(alfabeto);

    // letra principal
    this.letraAhora = this.alfabetoAlAzar[0].letra;
    this.audioLetraAhora.src = 'assets/letra_sonidos/' + this.letraAhora + '.MP3';    

    // tres opciones
    this.opciones = this.shuffle([
      this.alfabetoAlAzar[0], 
      this.alfabetoAlAzar[1], 
      this.alfabetoAlAzar[2]
    ]);

    // objeto de sonidos para todos las opciones
    this.opciones.forEach(Letra  => {
      this.audioOpciones[Letra.letra] = new Audio('/assets/letra_sonidos/' + Letra.letra + '.MP3');
      // archivos palabra en puro menisculo
      var palabraLower = Letra.palabra.toLowerCase();      
      this.audioOpciones[Letra.palabra] = new Audio('/assets/palabras/' + palabraLower + '.MP3');
    });

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
