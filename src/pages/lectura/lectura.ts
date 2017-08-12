import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { LecturaModel } from '../../models/lectura.model';
import { LecturasContent } from './lecturas.content';
import { ItemDetailPage } from '../item-detail/item-detail';

import { AudioFileService } from '../../building.blocks/audio.file.service';
import { Maguito } from '../../building.blocks/maguito.component';

import { Howl } from 'howler';
var lecturasSprite = require('../../assets/audios/lecturas/lecturasSprite.json');

@Component({
  selector: 'lecturas',
  template: `
    <ion-header>
      <button ion-button icon-only (click)="volver()">
        <ion-icon name="home"></ion-icon>
      </button>
      <ion-title>Lecturas</ion-title>
      <button class="nav-button volume" (click)="afs.playPauseBackgroundMusic()">
        <span *ngIf="!afs.backgroundMusicHowl.playing()"  id="music-off">\\\</span>
        <ion-icon name="musical-notes"></ion-icon>
      </button>
    </ion-header>

    <div *ngIf="afs.isWeb && !allLoadedBool" id="loading">
      <img id="loader-circle" src="assets/maguito/loader.gif">
      <maguito></maguito>
    </div>

    <ion-content padding>
      <img #bgImg class="bg-img" src="assets/fondos/FONDO-LECTURAS.jpg"> 
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

  lecturasHowl:Howl;
  @ViewChild('bgImg') bgImg:ElementRef;
  bgLoaded:Observable<any>;
  instructionLoaded:Observable<any>;  
  allLoaded:Observable<any>;
  allLoadedBool:boolean = false;

  constructor (
    public navCtrl: NavController,
    public lecturas: LecturasContent, 
    public platform: Platform, 
    public afs: AudioFileService,
    private change: ChangeDetectorRef
      ) {

    if (platform.is('cordova')) {
      this.lecturasHowl = new Howl({
        src: [
          "assets/audios/lecturas/lecturasSprite.webm",
          "assets/audios/lecturas/lecturasSprite.mp3"
        ],
        sprite: lecturasSprite.sprite,
        html5: true
      });
    } else {
      this.lecturasHowl = new Howl({
        src: [
          "assets/audios/lecturas/lecturasSprite.webm",
          "assets/audios/lecturas/lecturasSprite.mp3"
        ],
        sprite: lecturasSprite.sprite
      });
    }
  }
  
  ngAfterViewInit () {
    //
    // LOADING LOGIC
    //
    if(this.afs.isWeb) {

      // observables from load events of bg image and instruction audio
      this.bgLoaded = Observable.fromEvent(this.bgImg.nativeElement, 'load');

      if ( this.lecturasHowl.state() === 'loading' ) {
        this.instructionLoaded = Observable.fromEvent(this.lecturasHowl, 'load');
        this.allLoaded = Observable.zip(this.bgLoaded, this.instructionLoaded);
        this.allLoaded.subscribe(status => {
          this.clearLoadingPlayInstruction();
        });
      } else {
        this.bgLoaded.subscribe(() => {
          this.clearLoadingPlayInstruction();          
        })
      }

    } else {
      this.clearLoadingPlayInstruction();
    }
  }

  clearLoadingPlayInstruction(){
    this.allLoadedBool = true;
    // tell angular to trigger change detection.
    // necessary for Web Audio API or angular will wait for subsequent click
    this.change.detectChanges(); 
    
    setTimeout(() => {
      this.lecturasHowl.play('instruccion');
    },2000);
  }


  openItem(lectura: LecturaModel) {
    
    this.lecturasHowl.play(this.afs.transliterate(lectura.fileName));

    this.navCtrl.push(ItemDetailPage, {
      lectura: lectura
    });
  }

  volver() {
    this.navCtrl.pop();
  }

}
