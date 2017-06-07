import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

import { ElegirImagen } from '../elegirImagen/elegirImagen';
import { Bloques } from '../bloques/bloques';
import { Matching } from '../matching/matching';
import { Lectura } from '../lectura/lectura';

import { AudioFileService } from '../../building.blocks/audio.file.service';
import { Maguito } from '../../building.blocks/maguito.component';

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
        <span *ngIf="!afs.backgroundMusicPlaying"  id="music-off">\\\</span>
        <ion-icon name="musical-notes"></ion-icon>
      </button>
      <div id="home-container" [class.show-content]="isMobileWeb || entradaEnded">
        <img #bgImg class="bg-img" src="assets/fondos/FONDO4.png">
        <div id="mlm"><img src="assets/home/mlm.png"></div>
        <div id="menu-buttons">
          <div class="home-button" *ngFor="let p of pages" (click)="openPage(p)" [attr.data-audio]="p.audioFileName">{{p.title}}</div>
        </div>
        <div id="maguito-menu">
          <a class="home-button" target="_blank" href="http://milibromagico.com.mx/">Sitio web</a>
          <a class="home-button" target="_blank" href="https://www.youtube.com/channel/UCg9rOiFz4riAK-P-nkS4r7g">Videos</a>
          <a class="home-button" target="_blank" href="http://milibromagico.com.mx/index.php/tienda-en-linea">Tienda <br>en linea</a>
          <maguito [class.maguitohidden]="!entradaEnded"></maguito>
        </div>
      </div>
      <div #entradaContainer id="entrada-container" [class.entrada-fade-out]="entradaEnded">
        <video *ngIf="!isMobileWeb" #entradaVideo id="entrada" preload="auto" src="assets/home/entrada.mp4"></video>
      </div>
      <span id="creditos" (click)="openCredits()">Creditos</span>
    </ion-content>
  `
})
export class HomePage implements AfterViewInit {
  
  pages: any[] = [
    { title: 'Letras', 
      audioFileName: 'letras',
      component: ElegirImagen,
      requiredAudios: ['letters', 'words', 'muybien', 'beep', 'bell']
    },
    { title: 'Bloques', 
      audioFileName: 'bloques',
      component: Bloques,
      requiredAudios: ['silables', 'silableWords', 'muybien', 'incorrecto']
    },
    { title: 'Pares', 
      audioFileName: 'pares',
      component: Matching,
      requiredAudios: ['words', 'muybien', 'incorrecto', 'bell']
    },
    { title: 'Lecturas de Comprensión', 
      audioFileName: 'lecturas',
      component: Lectura,
      requiredAudios: ['lecturas']      
    }
  ];

  buttonAudios = {};
  openPageRunning:boolean = false;

  isMobileWeb:boolean;
  @ViewChild('bgImg') bgImg:ElementRef;
  bgLoaded:Observable<any>;
  @ViewChild('entradaContainer') entradaContainer:ElementRef;
  entradaLoaded:Observable<any>;
  @ViewChild('entradaVideo') entradaVideo:ElementRef;
  entradaVideoLoaded:Observable<any>;
  backgroundMusicLoaded:Observable<any>;
  allLoaded:Observable<any>;
  allLoadedBool:boolean;
  entradaEnded:boolean;

  constructor(
    public navCtrl: NavController, 
    public platform: Platform, 
    public afs: AudioFileService,
    private alertCtrl: AlertController
    ) {

    this.pages.forEach(page => {

      // populate page title audios
      this.afs.homePageButtons[page.audioFileName] = new Audio("assets/titulos/" + page.audioFileName + '.MP3');

    });

    this.isMobileWeb = platform.is('mobileweb');
    this.entradaEnded = false;

  }

  ngAfterViewInit() {

    if (this.afs.isWeb ){
      this.bgLoaded = Observable.fromEvent(this.bgImg.nativeElement, 'load');
    } else {
      this.startEntrada();
    }

    if ( this.isMobileWeb ) {

      // don't show entrada
      this.bgLoaded.subscribe(() => {
        console.log('allLoaded mobileweb');
        // remove loading
        this.allLoadedBool = true;
        // hide entrada video, show maguito below
        this.endEntrada();
      });

    } else {

      // when entradaVideo finishes, hide entrada video, show maguito below
      this.entradaVideo.nativeElement.addEventListener('ended', () => {
        this.endEntrada();
        // music
        this.afs.playPauseBackgroundMusic();
      });

    }

    if ( this.platform.is('core') ) {
      // background music attributes
      this.afs.backgroundMusic.loop = true;
      this.afs.backgroundMusic.volume = 0.2;
      
      this.entradaVideoLoaded = Observable.fromEvent(this.entradaVideo.nativeElement, 'canplaythrough');
      this.backgroundMusicLoaded = Observable.fromEvent(this.afs.backgroundMusic, 'canplaythrough');

      this.allLoaded = Observable.zip(this.bgLoaded, this.entradaVideoLoaded, this.backgroundMusicLoaded);

      this.allLoaded.subscribe(status => {
        console.log('allLoaded');
        this.allLoadedBool = true;
        this.startEntrada();
      });
    }

  }

  startEntrada() {
      this.entradaVideo.nativeElement.play();
  }

  endEntrada() {
      this.entradaEnded = true;
      setTimeout(()=> {
        this.entradaContainer.nativeElement.style.display = 'none';
      }, 1000)
  }

  openPage(page) {
    if (!this.openPageRunning) {
      this.openPageRunning = true;

      if ( this.afs.homePageButtons[page.audioFileName].readyState > 0 ){
        this.afs.homePageButtons[page.audioFileName].play(); // playWhenReady played upon playPause triggered by volver();
      }
      
      this.afs.populateInstruction(page.audioFileName);

      if (page.hasOwnProperty('requiredAudios') && typeof(page.requiredAudios === "array")) {
        page.requiredAudios.forEach(requiredAudio => {
          // console.log('from openPage(): ', requiredAudio);
          this.afs.populateAudios(requiredAudio);
        });
      }

      if (typeof(this.afs.homePageButtons[page.audioFileName]) === 'object' 
        && this.afs.homePageButtons[page.audioFileName].duration > 0 ) {

        let durationMiliseconds = this.afs.homePageButtons[page.audioFileName].duration * 1000;
        console.log(durationMiliseconds); 
        setTimeout(() => {
          this.openPageRunning = false;
          this.navCtrl.push(page.component);
        }, durationMiliseconds);

      } else {
        
        this.openPageRunning = false;
        this.navCtrl.push(page.component);

      }
    }
  }

  openCredits() {
    let alert = this.alertCtrl.create({
      title: 'Creditos',
      message: 'Applicación por Bikit Puy Comunicación y Diseño. Contactenos al <a href="mailto:bikitpuy@gmail.com">bikitpuy@gmail.com</a>',
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

}
