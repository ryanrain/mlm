import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
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
    <button *ngIf="afs.backgroundMusicPlaying" class="nav-button volume" (click)="afs.pauseBackgroundMusic()"><ion-icon name="volume-up"></ion-icon></button>
    <button *ngIf="!afs.backgroundMusicPlaying" class="nav-button volume" (click)="afs.playBackgroundMusic()"><ion-icon name="volume-off"></ion-icon></button>
    <ion-content padding>
      <img #bgImg class="bg-img" src="assets/fondos/FONDO4.png">
      <div *ngIf="afs.isWeb && !allLoadedBool" id="loading">
        <img id="loader-circle" src="assets/maguito/loader.gif">
        <maguito></maguito>
      </div>
      <div id="mlm"><img src="assets/home/mlm.png"></div>
      <div id="menu-buttons">
        <div class="home-button" *ngFor="let p of pages" (click)="openPage(p)" [attr.data-audio]="p.audioFileName">{{p.title}}</div>
      </div>
      <div id="maguito-menu">
        <a class="home-button" href="http://milibromagico.com.mx/">Sitio web</a>
        <a class="home-button" href="https://www.youtube.com/channel/UCg9rOiFz4riAK-P-nkS4r7g">Videos</a>
        <a class="home-button" href="http://milibromagico.com.mx/index.php/tienda-en-linea">Tienda <br>en linea</a>
        <maguito [class.maguitohidden]="!entradaEnded"></maguito>
      </div>
      <div #entradaContainer id="entrada-container">
        <img #entrada id="entrada" src="assets/home/maguito-entrada.gif">
      </div>
      <div style="display:none;" class="preloader">
        <audio #entradaAudio preload="auto" src="assets/home/miLibroMagico.MP3"></audio>
      </div>
    </ion-content>
  `
})
export class HomePage implements AfterViewInit {
  
  pages: any[] = [
    { title: 'Letras', 
      audioFileName: 'letras',
      component: ElegirImagen,
      requiredAudios: ['letters', 'words', 'muybien']
    },
    { title: 'Bloques', 
      audioFileName: 'bloques',
      component: Bloques,
      requiredAudios: ['silables', 'silableWords', 'muybien']
    },
    { title: 'Pares', 
      audioFileName: 'pares',
      component: Matching,
      requiredAudios: ['words', 'muybien']
    },
    { title: 'Lecturas de Comprensión', 
      audioFileName: 'lecturas',
      component: Lectura,
      requiredAudios: ['lecturas']      
    }
  ];

  buttonAudios = {};
  openPageRunning:boolean = false;

  @ViewChild('bgImg') bgImg:ElementRef;
  bgLoaded:Observable<any>;
  @ViewChild('entrada') entradaImg:ElementRef;
  @ViewChild('entradaContainer') entradaContainer:ElementRef;
  entradaLoaded:Observable<any>;
  @ViewChild('entradaAudio') entradaAudio:ElementRef;
  entradaAudioLoaded:Observable<any>;
  backgroundAudioLoaded:Observable<any>;
  allLoaded:Observable<any>;
  allLoadedBool:boolean;
  entradaEnded:boolean = false;

  constructor(public navCtrl: NavController, public platform: Platform, public afs: AudioFileService) {

    this.pages.forEach(page => {
      // populate page title audios
      // no need to go through service because directly in the "gesture"
      page['audio'] = new Audio("assets/titulos/" + page.audioFileName + '.MP3');

      // when page title audio finishes, nav to the page
      page['audio'].addEventListener('ended', () => {
        this.openPageRunning = false;
        this.navCtrl.push(page.component);
      });
    });

    // populate maguito risa audios
    this.afs.populateAudios('risa');
  }

  ngAfterViewInit() {

    // when entradaAudio finishes, hide entrada gif, show maguito below
    this.entradaAudio.nativeElement.addEventListener('ended', () => {
      this.entradaContainer.nativeElement.classList.remove('show-entrada');
      this.entradaEnded = true;
    });

    this.afs.backgroundMusic.autoplay = true;
    this.afs.backgroundMusic.loop = true;
    this.afs.backgroundMusic.volume = 0.2;
    this.afs.backgroundMusic.pause();

    if (this.afs.isWeb ){
      this.bgLoaded = Observable.fromEvent(this.bgImg.nativeElement, 'load');
      this.entradaLoaded = Observable.fromEvent(this.entradaImg.nativeElement, 'load');
      this.entradaAudioLoaded = Observable.fromEvent(this.entradaAudio.nativeElement, 'canplaythrough');
      this.backgroundAudioLoaded = Observable.fromEvent(this.afs.backgroundMusic, 'canplaythrough');
      
      this.allLoaded = Observable.zip(this.bgLoaded, this.entradaLoaded, this.entradaAudioLoaded);

      this.allLoaded.subscribe(status => {
        console.log('allLoaded');
        this.allLoadedBool = true;
        this.startEntrada();
      });
    } else {
        this.startEntrada();
    }

  }

  startEntrada() {
      this.entradaContainer.nativeElement.classList.add('show-entrada');  
      this.entradaAudio.nativeElement.play();
      this.afs.backgroundMusic.play();
  }

  openPage(page) {
    if (!this.openPageRunning) {
      this.openPageRunning = true;

      page.audio.play();

      if (page.hasOwnProperty('requiredAudios') && typeof(page.requiredAudios === "array")) {
        page.requiredAudios.forEach(requiredAudio => {
          // console.log('from openPage(): ', requiredAudio);
          this.afs.populateAudios(requiredAudio);
        });
      }

      this.afs.populateInstructions(page.audioFileName);

    }
  }

}
