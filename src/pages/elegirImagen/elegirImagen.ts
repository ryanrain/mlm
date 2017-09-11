import { Component, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef, ChangeDetectorRef } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/throttleTime';

import { Platform } from 'ionic-angular';

import { AlfabetoCastillano } from '../../castillano/alfabeto.castillano';
import { LetraModel } from '../../models/letra.model';
import { AudioFileService } from '../../building.blocks/audio.file.service';
import { Maguito } from '../../building.blocks/maguito.component';

import { Howl } from 'howler';
var letrasSprite = require('../../assets/audios/letras/letrasSprite.json');

@Component({
  selector: 'page-elegir-imagen',
  template: `
  <button class="nav-button home" (click)="afs.volver()"><ion-icon name="home"></ion-icon></button>
  <button class="nav-button volume" (click)="afs.playPauseBackgroundMusic()">
    <span *ngIf="!afs.backgroundMusicHowl.playing()"  id="music-off">\\\</span>
    <ion-icon name="musical-notes"></ion-icon>
  </button>
  <div *ngIf="afs.isWeb && !audioLoaded" id="loading">
    <img id="loader-circle" src="assets/maguito/loader.gif">
    <maguito></maguito>
  </div>

  <ion-content padding [class.arriba]="imagenArriba">
    <img class="bg-img" src="assets/fondos/FONDO4-sky.jpg">
    <div #letraAhoraRef id="letra-principal">
      <div>
        <span *ngIf="palabraAhora == ''">{{letraAhora}}</span>
        {{palabraAhora}}
      </div>
    </div>
    <div id="imagenes-letra">
      <img #opcion1 src="assets/imagenes/{{afs.transliterate(opciones[0].palabra)}}.png" [id]="opciones[0].letra" [class]="opciones[0].palabra">
      <img #opcion2 src="assets/imagenes/{{afs.transliterate(opciones[1].palabra)}}.png" [id]="opciones[1].letra" [class]="opciones[1].palabra">
      <img #opcion3 src="assets/imagenes/{{afs.transliterate(opciones[2].palabra)}}.png" [id]="opciones[2].letra" [class]="opciones[2].palabra">
    </div>
  </ion-content>
  <div style="display:none;" class="preloader">
    <img rel="preload" *ngFor="let letra of castillano.alfabeto" src="assets/imagenes/{{afs.transliterate(letra.palabra)}}.png">
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
  
  audioLoaded:boolean = false;

  @ViewChildren('opcion1,opcion2,opcion3') opcionesBotones:QueryList<ElementRef>;
  @ViewChild('letraAhoraRef') letraAhoraRef:ElementRef;

  letrasHowl:Howl;

  constructor(
    public castillano: AlfabetoCastillano,
    public platform: Platform, 
    public afs: AudioFileService,
    private change: ChangeDetectorRef
    ) {
    this.nuevaLetra(this.castillano.alfabeto);

    this.letrasHowl = new Howl({
      src: [
        "assets/audios/letras/letrasSprite.webm",
        "assets/audios/letras/letrasSprite.mp3"
      ],
      sprite: letrasSprite.sprite
    });

  }

  ngAfterViewInit() {
    
    //
    // LOADING LOGIC
    // wait until audio sprite has loaded before removing the loading panel
    //
    switch (this.letrasHowl.state()) {
      
      case 'loading' :
        console.log('loading letras sprite');
        this.letrasHowl.on('load', () => {
          console.log('letras sprite loaded');          
          this.clearLoadingPlayInstruction(this.letraAhora);
        });
      break;

      case 'loaded' :
        console.log('letras sprite loaded');      
        this.clearLoadingPlayInstruction(this.letraAhora);
      break;

      case 'unloaded' :
        console.log('letras sprite unloaded...');
      break;

    }

    //
    // CLICK EVENTS SETUP
    //

    // BIG LETTER
    this.letraClicks = Observable.fromEvent(this.letraAhoraRef.nativeElement, 'click');
    this.letraClicks
      .throttleTime(1000)
      .subscribe(clickEvent => {
        this.letrasHowl.play(this.letraAhora);
      })
    ;
    
    // IMAGES BELOW
    // Set up single Observable of click events on any of the image choices
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

    // Subscribe to that single observable to act on button clicks
    this.intentos
      .throttleTime(1000)    
      .subscribe(clickEvent => {
        // visual indication of click
        clickEvent.target.style.boxShadow = '0 0 2vh 0.3vh brown inset';

        // play audio word of clicked image
        let palabra = clickEvent.target.classList[0];
        this.afs.palabrasHowl.play(this.afs.transliterate(palabra));

        // if correct choice, start CHAIN OF SUCCESS EVENTS
        let letra = clickEvent.target.id;
        if( letra === this.letraAhora ) {

          // note these setTimeout all start at the same time.
          let delay1 = 500,
              delay2 = delay1 + 2000,
              delay3 = delay2 + 1500,
              delay4 = delay3 + 1500;

          setTimeout(
            ()=>{
              clickEvent.target.style.boxShadow = '';              
              this.celebrar(clickEvent.target);
              this.subirImagen();
            },
            delay1
          );

          setTimeout(
            () => {
              this.letrasHowl.play(letra);              
            },
            delay2
          );

          setTimeout(
            () => {
              this.mostrarPalabra(palabra);
              this.afs.palabrasHowl.play(this.afs.transliterate(palabra)); 
            },
            delay3
          );
          // and finally reset game to new letter
          setTimeout(
            () => {
              this.reset();
              this.nuevaLetra(this.castillano.alfabeto);
            },
            delay4
          );
        // or if INCORRECT image choice
        } else {
          setTimeout(
            ()=>{
              clickEvent.target.style.boxShadow = '';               
              this.afs.appHowl.play('beep');
            },
            1200
          );
        }
      })
    ;

  } // ngAfterViewInit

  clearLoadingPlayInstruction(letra:string){
    this.audioLoaded = true;
    // tell angular to trigger change detection.
    // necessary for Web Audio API or angular will wait for subsequent click
    this.change.detectChanges();
    
    setTimeout(() => {
      let instructionId = this.letrasHowl.play('instruccion');
      this.letrasHowl.once('end', () => {
        this.letrasHowl.play(letra)
      }, instructionId);
    },1000);
  }
  
  celebrar(boton){
    boton.classList.add('woohoo');
    setTimeout(() => {
      this.afs.appHowl.play('bell');
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
    });
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

}
