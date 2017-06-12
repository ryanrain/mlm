import { Component, AfterViewInit } from '@angular/core';

import { NavController } from 'ionic-angular';

import { LecturaModel } from '../../models/lectura.model';
import { LecturasContent } from './lecturas.content';
import { ItemDetailPage } from '../item-detail/item-detail';

import { AudioFileService } from '../../building.blocks/audio.file.service';

@Component({
  selector: 'lecturas',
  template: `
    <ion-header>
      <button ion-button icon-only (click)="volver()">
        <ion-icon name="home"></ion-icon>
      </button>
      <ion-title>Lecturas</ion-title>
      <button class="nav-button volume" (click)="afs.playPauseBackgroundMusic()">
        <span *ngIf="!afs.backgroundMusicPlaying"  id="music-off">\\\</span>
        <ion-icon name="musical-notes"></ion-icon>
      </button>
    </ion-header>

    <ion-content padding>
      <div id="lecturas-list">
        <div *ngFor="let lectura of lecturas.lecturas" (click)="openItem(lectura)">
          <img src="assets/lecturas/{{lectura.fileName}}.png">
          <h5>{{lectura.title}}</h5>
        </div>
      </div>
    </ion-content>
  `
})
export class Lectura implements AfterViewInit {

  constructor (
    public navCtrl: NavController,
    public lecturas: LecturasContent, 
    public afs: AudioFileService
      ) {

    this.afs.populatePageAudios('lecturas');

  }
  
  ngAfterViewInit () {
    this.afs.playWhenReady(this.afs.instructions['lecturas']);
  }

  openItem(lectura: LecturaModel) {
    
    this.afs.playWhenReady(this.afs.lecturas[lectura.fileName]);

    this.navCtrl.push(ItemDetailPage, {
      lectura: lectura
    });
  }

  volver() {
    this.afs.playPause(this.afs.homePageButtons);
    this.navCtrl.pop();
  }

}
