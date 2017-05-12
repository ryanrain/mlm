import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Observable} from 'rxjs/Observable';

import { ElegirImagen } from '../elegirImagen/elegirImagen';
import { Bloques } from '../bloques/bloques';
import { Matching } from '../matching/matching';
import { Lectura } from '../lectura/lectura';


@Component({
  selector: 'page-home',
  // templateUrl: 'home.html'
  template: `
    <ion-content padding>
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

  constructor(public navCtrl: NavController) {
  }

  ngAfterViewInit() {
    this.maguitoClicks = Observable.fromEvent(this.maguito.nativeElement, 'click');
    this.maguitoClicks.subscribe(event => {
      this.audioChing.play();
    });
  }

  openPage(page) {
    this.navCtrl.push(page.component);
  }

}
