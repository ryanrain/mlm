import { Component, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/zip';

import { NavController, Platform } from 'ionic-angular';

import { AlfabetoCastillano } from '../../alfabetos/alfabeto.castillano';
import { LetraModel } from '../../models/letra.model';

@Component({
  selector: 'page-elegir-imagen',
  // templateUrl: 'elegirImagen.html'
  template: `
  <button class="nav-button" (click)="volver()"><ion-icon name="home"></ion-icon></button>

  <ion-content padding [class.arriba]="imagenArriba">
  
    <img #bgImg class="bg-img" src="/assets/fondos/FONDO4-sky.png">
    
    <div id="loading" *ngIf="!allLoadedBool">
      <img id="loader-circle" src="/assets/menu/loader.gif">
      <img #maguito id="maguito" src="/assets/menu/maguito.png">
    </div>

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
  <div style="display:none;" class="preloader">
    <img rel="preload" *ngFor="let letra of castillano.alfabeto" src="/assets/imagenes/{{letra.palabra}}.png">
  </div>
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
  bienAudios = {};
  audioLetraAhora = new Audio;
  audioOpciones = {};
  audioInstruccion:HTMLAudioElement; 
  
  bgLoaded:Observable<any>;
  firstAudiosLoaded:Observable<any>;
  instruccionLoaded:Observable<any>;
  allLoaded:Observable<any>;
  allLoadedBool:boolean = false;

  maguitoClicks:Observable<any>;
  @ViewChild('maguito') maguito:ElementRef;

  @ViewChildren('opcion1,opcion2,opcion3') opcionesBotones:QueryList<ElementRef>;
  @ViewChild('letraAhoraRef') letraAhoraRef:ElementRef;
  @ViewChild('bgImg') bgImg:ElementRef;

  constructor(
    public navCtrl: NavController,
    public castillano: AlfabetoCastillano,
    public platform: Platform
    ) {
    this.nuevaLetra(this.castillano.alfabeto);
    this.audioInstruccion = new Audio('/assets/instrucciones/letras.MP3');

    // Preload first set of Audio objects for all button words and letter
    this.opciones.forEach(Letra  => {
      // archivos palabra en puro menisculo
      let palabraLower = Letra.palabra.toLowerCase();      
      this.audioOpciones[Letra.palabra] = new Audio('/assets/palabras/' + palabraLower + '.MP3');
    });

    this.preloadBienAudios();
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
              delay2 = delay1 + 2000,
              delay3 = delay2 + 1500,
              delay4 = delay3 + 1500;

          setTimeout(
            ()=>{
              this.celebrar(clickEvent.target);
              this.subirImagen();
            },
            delay1
          );
          setTimeout(
            () => {
              this.escuchar(letra);
            },
            delay2
          );
          setTimeout(
            () => {
              this.mostrarPalabra(palabra);
              this.escuchar(palabra);
            },
            delay3
          );
          setTimeout(
            () => {
              this.reset();
              this.nuevaLetra(this.castillano.alfabeto);
            },
            delay4
          );
        }
      })
    ;

    this.bgLoaded = Observable.fromEvent(this.bgImg.nativeElement, 'load');

    if (this.platform.is('ios')) {

      this.bgLoaded.subscribe(status => {
        this.allLoadedBool = true;
        this.audioInstruccion.play();
        setTimeout(() => {
          this.audioLetraAhora.play();
        },2800);

        this.preloadWordAndLetterAudios();
      });

    } else {
      this.firstAudiosLoaded = Observable.fromEvent(this.audioOpciones[this.opciones[2].palabra], 'canplaythrough');
      this.instruccionLoaded = Observable.fromEvent(this.audioInstruccion, 'canplaythrough');

      this.allLoaded = Observable.zip(this.bgLoaded, this.firstAudiosLoaded, this.instruccionLoaded);

      this.allLoaded.subscribe(array => {
        this.allLoadedBool = true; // hide loading overlay

        this.audioInstruccion.play();
        setTimeout(() => {
          this.audioLetraAhora.play();
        },2800);

        this.preloadWordAndLetterAudios();
      });

    }

    this.maguitoClicks = Observable.fromEvent(this.maguito.nativeElement, 'click');
    this.maguitoClicks.subscribe(event => {
      this.audioChing.play();
    });

  }
  
  celebrar(boton){
    boton.classList.add('woohoo');
    // this.audioChing.play();
    setTimeout(() => {
      this.playRandomBienAudio();
    }, 500);
  }
  
  preloadWordAndLetterAudios() {
    // filter out the first set?
    this.castillano.alfabeto.forEach(Letra  => {
      this.audioOpciones[Letra.letra] = new Audio('/assets/letra_sonidos/' + Letra.letra + '.MP3');
      // archivos palabra en puro menisculo
      let palabraLower = Letra.palabra.toLowerCase();      
      this.audioOpciones[Letra.palabra] = new Audio('/assets/palabras/' + palabraLower + '.MP3');
    });
  }

  preloadBienAudios(){
    ['0','1','2','3','4','5','6'].forEach(number => {
      this.bienAudios[number] = new Audio("assets/muybien/" + number + '.MP3');
    });
  }

  playRandomBienAudio(){
    let random = Math.round(Math.random() * 6.2);
    this.bienAudios[random.toString()].play();
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
