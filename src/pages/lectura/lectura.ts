import { Component, AfterViewInit } from '@angular/core';

import { NavController } from 'ionic-angular';

import { LecturaModel } from '../../models/lectura.model';
import { LecturasContent } from './lecturas.content';
import { ItemDetailPage } from '../item-detail/item-detail';

@Component({
  selector: 'lecturas',
  template: `
    <ion-header>
      <button ion-button icon-only (click)="volver()">
        <ion-icon name="home"></ion-icon>
      </button>
      <ion-title>Lecturas</ion-title>
    </ion-header>

    <ion-content padding>
      <div id="lecturas-list">
        <div *ngFor="let lectura of lecturas.lecturas" (click)="openItem(lectura)">
          <img src="assets/lecturas/{{lectura.img}}">
          <h5>{{lectura.title}}</h5>
        </div>
      </div>
    </ion-content>
  `
})
export class Lectura implements AfterViewInit {

  bienAudios = {};
  audioChing = new Audio('/assets/ching.mp3');
  audioInstruccion:HTMLAudioElement;

  constructor (
    public navCtrl: NavController,
    public lecturas: LecturasContent
      ) {
      this.preloadBienAudios();
      this.audioInstruccion = new Audio('/assets/instrucciones/lecturas.MP3');
  }

  ngAfterViewInit() {
    this.audioInstruccion.play();
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

  celebrate() {
    this.playRandomBienAudio();
  }

  openItem(lectura: LecturaModel) {
    this.navCtrl.push(ItemDetailPage, {
      lectura: lectura,
      lecturas: this.lecturas
    });
  }

  volver() {
    this.navCtrl.pop();
  }

}
