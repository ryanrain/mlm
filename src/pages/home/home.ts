import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

import { ElegirImagen } from '../elegirImagen/elegirImagen';
import { Bloques } from '../bloques/bloques';
import { Matching } from '../matching/matching';
import { Lectura } from '../lectura/lectura';

import { AudioFileService } from '../../services/audio.file.service';

@Component({
  selector: 'page-home',
  // templateUrl: 'home.html'
  template: `
    <ion-content padding>
      <img #bgImg class="bg-img" src="/assets/fondos/FONDO4.png">
      <div id="loading" *ngIf="!allLoadedBool">
        <img id="loader-circle" src="/assets/menu/loader.gif">
        <img id="maguito" src="/assets/menu/maguito.png">
      </div>
      <div id="mlm"></div>
      <div id="menu-buttons"><div *ngFor="let p of pages" (click)="openPage(p)" [attr.data-audio]="p.audioFileName">{{p.title}}</div></div>
      <div #maguito id="maguito"></div>
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
      component: Lectura
    }
  ];

  pageAlreadyLoaded = {};
  @ViewChild('maguito') maguito:ElementRef;
  maguitoClicks:Observable<any>;
  audioChing = new Audio('/assets/ching.mp3');
  buttonAudios = {};
  openPageRunning:boolean = false;

  bgLoaded:Observable<any>;
  buttonAudiosLoaded:Observable<any>;
  allLoaded:Observable<any>;
  allLoadedBool:boolean = false;
  @ViewChild('bgImg') bgImg:ElementRef;

  constructor(public navCtrl: NavController, public platform: Platform, public afs: AudioFileService) {
    this.pages.forEach(page => {
      // no need to go through service because directly in the "gesture"
      page['audio'] = new Audio("assets/titulos/" + page.audioFileName + '.MP3');
      page['audio'].addEventListener('ended', () => {
        this.openPageRunning = false;
        this.navCtrl.push(page.component);
      });
    });

  }

  ngAfterViewInit() {
    // CLICKABLE MAGUITO
    this.maguitoClicks = Observable.fromEvent(this.maguito.nativeElement, 'click');
    this.maguitoClicks.subscribe(event => {
      this.audioChing.play();
    });

    // LOADING SCREEN
        this.allLoadedBool = true;        
    
    // this.bgLoaded = Observable.fromEvent(this.bgImg.nativeElement, 'load');
    
    // if (this.platform.is('ios')) {
    //   this.bgLoaded.subscribe(status => {
    //     this.allLoadedBool = true;
    //   });
    // } else {
    //   this.buttonAudiosLoaded = Observable.fromEvent(this.buttonAudios[this.pages[this.pages.length - 1].audioFileName], 'canplaythrough');
    //   this.allLoaded = Observable.zip(this.bgLoaded, this.buttonAudiosLoaded);
    //   this.allLoaded.subscribe(array => {
    //     this.allLoadedBool = true;        
    //   });
    // }
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
