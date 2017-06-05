import { Component, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/throttleTime';

import { NavController, Platform } from 'ionic-angular';

import { AlfabetoCastillano } from '../../castillano/alfabeto.castillano';
import { LetraModel } from '../../models/letra.model';
import { AudioFileService } from '../../building.blocks/audio.file.service';
import { Maguito } from '../../building.blocks/maguito.component';

@Component({
  selector: 'page-elegir-imagen',
  template: `
  <button class="nav-button" (click)="volver()"><ion-icon name="home"></ion-icon></button>
  <button class="nav-button volume" (click)="afs.playPauseBackgroundMusic()">
    <span *ngIf="!afs.backgroundMusicPlaying"  id="music-off">\\\</span>
    <ion-icon name="musical-notes"></ion-icon>
  </button>
  <div *ngIf="afs.isWeb && !allLoadedBool" id="loading">
    <img id="loader-circle" src="assets/maguito/loader.gif">
    <maguito></maguito>
  </div>

  <ion-content padding [class.arriba]="imagenArriba">
    <img #bgImg class="bg-img" src="assets/fondos/FONDO4-sky.png">
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
    <img rel="preload" *ngFor="let letra of castillano.alfabeto" src="assets/imagenes/{{letra.palabra}}.png">
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
  
  bgLoaded:Observable<any>;
  instructionLoaded:Observable<any>;
  allLoaded:Observable<any>;
  allLoadedBool:boolean = false;

  @ViewChildren('opcion1,opcion2,opcion3') opcionesBotones:QueryList<ElementRef>;
  @ViewChild('letraAhoraRef') letraAhoraRef:ElementRef;
  @ViewChild('bgImg') bgImg:ElementRef;

  constructor(
    public navCtrl: NavController,
    public castillano: AlfabetoCastillano,
    public platform: Platform, 
    public afs: AudioFileService
    ) {
    this.nuevaLetra(this.castillano.alfabeto);
  }

  ngAfterViewInit() {

    // empieza con la letra... ___
    this.afs.instructions['letras'].addEventListener('ended', () => {
      this.afs.playWhenReady(this.afs.letters[this.letraAhora]); 
      this.afs.instructions['letras'].removeEventListener('ended');
    });

    // LOADING LOGIC
    if(this.afs.isWeb) {
      this.bgLoaded = Observable.fromEvent(this.bgImg.nativeElement, 'load');

      if ( this.afs.instructions['letras'].networkState === 1 && this.afs.instructions['letras'].buffered.length === 0 ) {
        
        console.log('instruction not yet ready ', this.afs.instructions['letras'].readyState);
        this.instructionLoaded = Observable.fromEvent(this.afs.instructions['letras'], 'canplaythrough');
        this.allLoaded = Observable.zip(this.bgLoaded, this.instructionLoaded);

        this.allLoaded.subscribe(status => {
          this.allLoadedBool = true;
          this.afs.playWhenReady(this.afs.instructions['letras']);
        });

      } else {
        
        console.log('instruction ready ', this.afs.instructions['letras'].readyState);
        this.bgLoaded.subscribe(status => {
          this.allLoadedBool = true;
          this.afs.playWhenReady(this.afs.instructions['letras']);
        });

      } 

    } else {

      this.afs.playWhenReady(this.afs.instructions['letras']);

    }


    // que un 'click' en la letra haga sonar el audio de la letra
    this.letraClicks = Observable.fromEvent(this.letraAhoraRef.nativeElement, 'click');
    this.letraClicks
      .throttleTime(1000)
      .subscribe(clickEvent => {
        this.afs.playWhenReady(this.afs.letters[this.letraAhora]);        
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
        this.afs.playWhenReady(this.afs.words[palabra]);

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
              this.afs.playWhenReady(this.afs.letters[letra]);              
            },
            delay2
          );
          setTimeout(
            () => {
              this.mostrarPalabra(palabra);
              this.afs.playWhenReady(this.afs.words[palabra]);              
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
        } else {
          setTimeout(
            ()=>{
              this.afs.playWhenReady(this.afs.beep);
            },
            900
          );
        }
      })
    ;

  }
  
  celebrar(boton){
    boton.classList.add('woohoo');
    setTimeout(() => {
      this.afs.playWhenReady(this.afs.bell);
    }, 350);
    setTimeout(() => {
      this.afs.playRandomBienAudio();
    }, 500);
  }

  subirImagen(){
    this.imagenArriba = true;
    // animacion sube el imagen, achica la letra
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
    this.afs.playPause(this.afs.homePageButtons);
    this.navCtrl.pop();
  }

}
