import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import {Observable} from 'rxjs/Observable';

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
    <ion-content padding>
      <img #bgImg class="bg-img" src="assets/fondos/FONDO4.png">
      <div *ngIf="afs.isWeb && !allLoadedBool" id="loading">
        <img id="loader-circle" src="assets/menu/loader.gif">
        <maguito></maguito>
      </div>
      <div id="mlm"><img src="assets/menu/mlm.png"></div>
      <div id="menu-buttons"><div *ngFor="let p of pages" (click)="openPage(p)" [attr.data-audio]="p.audioFileName">{{p.title}}</div></div>
      <div id="maguito-menu">
        <maguito></maguito>
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
      component: Lectura
    }
  ];

  buttonAudios = {};
  openPageRunning:boolean = false;

  @ViewChild('bgImg') bgImg:ElementRef;
  bgLoaded:Observable<any>;
  allLoadedBool:boolean;

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

    if (this.afs.isWeb ){
      this.bgLoaded = Observable.fromEvent(this.bgImg.nativeElement, 'load');
      
      this.bgLoaded.subscribe(status => {
        this.allLoadedBool = true;
      });
    }


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
