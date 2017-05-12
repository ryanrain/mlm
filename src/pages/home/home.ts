import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

import { ElegirImagen } from '../elegirImagen/elegirImagen';
import { Bloques } from '../bloques/bloques';
import { Matching } from '../matching/matching';
import { Lectura } from '../lectura/lectura';


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
      <div id="menu-buttons"><div *ngFor="let p of pages" (click)="openPage(p)">{{p.title}}</div></div>
      <div #maguito id="maguito"></div>
    </ion-content>
  `
})
export class HomePage implements AfterViewInit {
  
  pages: any[] = [
    { title: 'Letras', component: ElegirImagen },
    { title: 'Bloques', component: Bloques },
    { title: 'Pares', component: Matching },
    { title: 'Lecturas de Comprensión', component: Lectura }
  ]
  @ViewChild('maguito') maguito:ElementRef;
  maguitoClicks:Observable<any>;
  audioChing = new Audio('/assets/ching.mp3');
  buttonAudioNames = ['pares','lecturas','bloques'];
  buttonAudios = {}

  bgLoaded:Observable<any>;
  buttonAudiosLoaded:Observable<any>;
  allLoaded:Observable<any>;
  allLoadedBool:boolean = false;
  @ViewChild('bgImg') bgImg:ElementRef;

  constructor(public navCtrl: NavController) {
    // pre-load an object of Audio objects
    this.buttonAudioNames.forEach(title => {
      this.buttonAudios[title] = new Audio("assets/titulos/" + title + '.MP3');
    });
  }

  ngAfterViewInit() {
    this.maguitoClicks = Observable.fromEvent(this.maguito.nativeElement, 'click');
    this.maguitoClicks.subscribe(event => {
      this.audioChing.play();
    });

    this.bgLoaded = Observable.fromEvent(this.bgImg.nativeElement, 'load');
    this.buttonAudiosLoaded = Observable.fromEvent(this.buttonAudios[this.buttonAudioNames[this.buttonAudioNames.length - 1]], 'canplaythrough');

    this.allLoaded = Observable.zip(this.bgLoaded, this.buttonAudiosLoaded);

    this.allLoaded.subscribe(array => {
      this.allLoadedBool = true;
    });

  }

  openPage(page) {
    this.navCtrl.push(page.component);
  }

}
