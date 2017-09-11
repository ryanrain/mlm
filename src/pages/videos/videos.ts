import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/retry';

import { Network } from '@ionic-native/network';
import { NavController, Platform } from 'ionic-angular';

import { AudioFileService } from '../../building.blocks/audio.file.service';
import { VideoPlayerPage } from '../video-player/video-player';

import { Howl } from 'howler';

// interface YoutubeResponse {
//   snippet: Array<any>;
//   title: string;
// }

@Component({
  selector: 'videos',
  template: `
    <ion-header>
      <button ion-button icon-only (click)="afs.volver()">
        <ion-icon name="home"></ion-icon>
      </button>
      <ion-title>Cuentos Mágicos</ion-title>
      <button class="nav-button volume" (click)="afs.playPauseBackgroundMusic()">
        <span *ngIf="!afs.backgroundMusicHowl.playing()"  id="music-off">\\\</span>
        <ion-icon name="musical-notes"></ion-icon>
      </button>
    </ion-header>

    <ion-content>

      <div *ngIf="videos.length === 0 && connection === ''" id="loading">
        <img id="loader-circle" src="assets/maguito/loader.gif">
        <maguito></maguito>
      </div>

      <div *ngIf="videos.length === 0 && connection === 'none'" class="connectivity-error">
        <div *ngIf="intentando">
          <img id="loader-circle" src="assets/maguito/loader.gif">
        </div>
        <p *ngIf="!intentando">
          Parece que no hay conexión al internet.
        </p>
        <button (click)="intentarDeNuevo()" #intentarButton>
          {{buttonText}} 
        </button>
      </div>

      <ion-card class="" *ngFor="let video of videos" (click)="openItem(video, $event)">
        <ion-card-content>
          <img [src]="video.snippet.thumbnails.medium.url">
          <h1>{{video.snippet.title}}</h1>
        </ion-card-content>
      </ion-card>

    </ion-content>
  `
})
export class Videos implements AfterViewInit {

  playlistId: string = 'PLlDRAccUbAY8x0MnTkvLqQB9RbspCi4o0';
  googleAPIKey: string = 'AIzaSyDs8v5byR03viYXwf072r7gXLarXTZvzXI';
  maxResults:number = 10;
  // loadedYoutube:boolean = false;
  videos:Array<any> = [];
  connection:string = '';
  buttonText = 'Intentar de nuevo';
  intentando:boolean = false;
  @ViewChild('intentarButton') intentarButton:ElementRef;
  videosHowl:Howl;

  constructor (
    public navCtrl:NavController, 
    public afs: AudioFileService,
    public http: Http,
    public platform: Platform,
    public network: Network,
      ) {
      
    if (platform.is('cordova')) {
      // unknown, ethernet, wifi, 2g, 3g, 4g, cellular, none
      console.log(network.type);

      this.videosHowl = new Howl({
        src: [
          "assets/audios/videos/instruccion.mp3"
        ]
      });
      
      // watch network for a connection
      let connectSubscription = this.network.onConnect().subscribe(() => {
        console.log('network connected!');
        // We just got a connection but we need to wait briefly
        // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
        setTimeout(() => {
          this.connection = this.network.type;
          console.log(this.network.type);

          if (this.network.type === '2g' ||
            this.network.type === '3g' ||
            this.network.type === '4g' ||
            this.network.type === 'cellular' ||
            this.network.type === 'unknown'
          ) {            
            this.videosHowl.play();
          }
        }, 3000);
      });

    } 


    this.getYoutubePlaylist();


  }
  
  ngAfterViewInit () {

  }


  getYoutubePlaylist(): void {

    let url = 'https://www.googleapis.com/youtube/v3/playlistItems?'
      + 'part=id,snippet'
      + '&playlistId=' + this.playlistId 
      + '&type=video'
      + '&order=viewCount'
      + '&maxResults=' + this.maxResults 
      + '&key=' + this.googleAPIKey;

    // if(this.pageToken) {
    //   url += '&pageToken=' + this.pageToken;
    // }

    this.http.get(url)
      .retry(2)
      .map(res => res.json())
      .subscribe(
        data => {
          this.videos = this.videos.concat(data.items);
          this.videos.map(video => {
            video.snippet.title = video.snippet.title.replace(/[|&;$%@"<>()+,.-] Mis cuentos mágicos/g,'');
          });
        }, 
        error => {
          this.connection = 'none';
          setTimeout( () => {
            this.intentando = false;
            if(this.intentarButton) {
              this.intentarButton.nativeElement.classList.remove('focus');
              this.buttonText = 'Intentar de nuevo';
            }
          },500);
        }
      );
  }

  intentarDeNuevo() {
    this.intentando = true;
    this.intentarButton.nativeElement.classList.add('focus');
    this.buttonText = 'Intentando...';
    this.getYoutubePlaylist();
  }

  openItem(video: any, $event) {
    this.navCtrl.push(VideoPlayerPage, {
      video: video
    });
  }

}

