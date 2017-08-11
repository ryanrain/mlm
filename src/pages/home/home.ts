import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

import { ElegirImagen } from '../elegirImagen/elegirImagen';
import { Bloques } from '../bloques/bloques';
import { Matching } from '../matching/matching';
import { Lectura } from '../lectura/lectura';
import { Videos } from '../videos/videos';

import { AudioFileService } from '../../building.blocks/audio.file.service';
import { Maguito } from '../../building.blocks/maguito.component';

import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-home',
  // templateUrl: 'home.html'
  template: `
    <div *ngIf="afs.isWeb && !allLoadedBool" id="loading">
      <img id="loader-circle" src="assets/maguito/loader.gif">
      <maguito></maguito>
    </div>
    <ion-content padding>
      <button class="nav-button volume" (click)="afs.playPauseBackgroundMusic()">
        <span *ngIf="!afs.backgroundMusicHowl.playing()"  id="music-off">\\\</span>
        <ion-icon name="musical-notes"></ion-icon>
      </button>
      <div id="home-container" [class.show-content]="isMobileWeb || showContentBool">
        <img #bgImg class="bg-img" src="assets/fondos/FONDO4.jpg">
        <div id="mlm"><img src="assets/home/mlm.png"></div>
        <div id="menu-buttons">
          <div class="home-button" *ngFor="let p of pages" (click)="openPage(p)" [attr.data-audio]="p.audioFileName">{{p.title}}</div>
        </div>
        <div id="maguito-menu">
          <a (click)="openLink($event)" class="home-button" target="_blank" href="http://milibromagico.com.mx/">Sitio web</a>
          <a (click)="openLink($event)" class="home-button" target="_blank" href="https://www.youtube.com/channel/UCg9rOiFz4riAK-P-nkS4r7g">Videos</a>
          <a (click)="openLink($event)" class="home-button" target="_blank" href="http://milibromagico.com.mx/index.php/tienda-en-linea">Tienda <br>en linea</a>
          <maguito [class.maguitohidden]="!showContentBool"></maguito>
        </div>
      </div>
      <div #entradaContainer id="entrada-container" [class.entrada-fade-out]="showContentBool">
        <video *ngIf="!isMobileWeb" #entradaVideo id="entrada" preload="auto" src="assets/home/entrada.mp4"></video>
      </div>
      <span id="creditos" (click)="openCredits()">Creditos</span>
    </ion-content>
  `
})
export class HomePage implements AfterViewInit {

  pages: any[] = [
    { 
        title: 'Letras', 
        audioFileName: 'letras',
        component: ElegirImagen    },
    { 
        title: 'Bloques', 
        audioFileName: 'bloques',
        component: Bloques
    },
    { 
        title: 'Pares', 
        audioFileName: 'pares',
        component: Matching
    },
    { 
        title: 'Lecturas de Comprensión', 
        audioFileName: 'lecturas',
        component: Lectura
    },
    { 
        title: 'Video Cuentos', 
        audioFileName: 'videocuentos',
        component: Videos
    }
  ];

  isMobileWeb:boolean;
  @ViewChild('bgImg') bgImg:ElementRef;
  bgLoaded:Observable<any>;
  @ViewChild('entradaContainer') entradaContainer:ElementRef;
  entradaLoaded:Observable<any>;
  @ViewChild('entradaVideo') entradaVideo:ElementRef;
  entradaVideoLoaded:Observable<any>;
  backgroundMusicLoaded:Observable<any>;
  allLoaded:Observable<any>;
  allLoadedBool:boolean = false;
  showContentBool:boolean;

  constructor(
    public navCtrl: NavController, 
    public platform: Platform, 
    public afs: AudioFileService,
    private alertCtrl: AlertController,
    private iab: InAppBrowser
    ) {

    this.isMobileWeb = platform.is('mobileweb');  // for redundant use in template
    this.showContentBool = false;

  }

  ngAfterViewInit() {

    //
    // LOADING LOGIC
    //

    // CORDOVA
    // if viewed as installed app, start video right away
    if ( !this.afs.isWeb ){
      this.allLoadedBool = true; // redundant
      this.startEntrada();
    }

    // MOBILEWEB
    // if viewed in a browser on a mobile device, skip the video but wait for bg load.
    if ( this.platform.is('mobileweb') ) {

      // watch for background image load
      this.bgLoaded = Observable.fromEvent(this.bgImg.nativeElement, 'load');

      // don't show entrada video
      this.bgLoaded.subscribe(() => {
        // remove loading
        this.allLoadedBool = true;
        // hide entrada video, show maguito below
        this.showContent();
        console.log('allLoaded mobileweb');
      });
    
    }  

    // LARGE-SCREEN WEB
    // if viewed in web browser on conventional computer,
    // wait for the background, video, and background music
    if (this.platform.is('core')) {

      // watch for background image load event
      this.bgLoaded = Observable.fromEvent(this.bgImg.nativeElement, 'load');
  
      // watch for video load event
      this.entradaVideoLoaded = Observable.fromEvent(this.entradaVideo.nativeElement, 'canplaythrough');
      
      // watch for background music load event
      this.backgroundMusicLoaded = Observable.fromEvent(this.afs.backgroundMusicHowl, 'load'); // usable here since will only load once.

      // all together
      this.allLoaded = Observable.zip(this.bgLoaded, this.entradaVideoLoaded, this.backgroundMusicLoaded);

      // and act on it.
      this.allLoaded.subscribe(status => {
        this.allLoadedBool = true;
        this.startEntrada();
        console.log('allLoaded');
      });
    }

    // CORDOVA AND LARGE-SCREEN WEB
    // everybody who saw the video, should hide it when it finishes, and start the music
    if ( !this.platform.is('mobileweb') ) {    
      // when entradaVideo finishes, hide entrada video, show maguito below
      this.entradaVideo.nativeElement.addEventListener('ended', () => {
        this.showContent();
        // play music
        this.afs.playPauseBackgroundMusic();
      });
    }

  }

  startEntrada() {
      this.entradaVideo.nativeElement.play();
  }

  showContent() {
      this.showContentBool = true;
      setTimeout(()=> {
        this.entradaContainer.nativeElement.style.display = 'none';
      }, 1000)
  }

  openPage(page) {
      this.afs.appHowl.play(page.audioFileName)
      this.navCtrl.push(page.component);
  }

  openCredits() {
    let alert = this.alertCtrl.create({
      title: 'Creditos',
      message: '<p>Applicación por Bikit Puy Comunicación y Diseño. <br>Contacto: <a href="mailto:bikitpuy@gmail.com">bikitpuy@gmail.com</a></p><p>"Happy Bee - Surf" Kevin MacLeod (incompetech.com)<br>Con licencia <a href="http://creativecommons.org/licenses/by/3.0/">Creative Commons 3.0</a></p>',
      cssClass: 'creditos-alert',
      buttons: [
        {
          text: ' ',
          role: 'cancel',
          cssClass: 'cerrar-creditos'
        }
      ]
    });
    alert.present();
  }

  openLink(event) {
    if (this.platform.is('cordova')) {
      event.preventDefault();
      this.iab.create(event.target.href, 'system');
    }
  }

}
