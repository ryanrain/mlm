import { Component, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';

import { Modal, NavController, Alert } from 'ionic-angular';

import { AudioFileService } from '../../building.blocks/audio.file.service';
import { VideoPlayerPage } from '../video-player/video-player';

@Component({
  selector: 'videos',
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
      <ion-list>

        <ion-item *ngFor="let video of videos" (click)="openItem(video)">
          <h5>{{video.snippet.title}}</h5>
          <img [src]="video.snippet.thumbnails.default.url">
        </ion-item>

      </ion-list>
    </ion-content>
  `
})
export class Videos {

  playlistId: string = 'PLlDRAccUbAY8x0MnTkvLqQB9RbspCi4o0';
  googleAPIKey: string = 'AIzaSyDs8v5byR03viYXwf072r7gXLarXTZvzXI';
  maxResults:number = 10;

  videos = [];

  constructor (
    public navCtrl:NavController, 
    public afs: AudioFileService,
    public http: Http
      ) {
    this.afs.populatePageAudios('videos');
    this.getYoutubePlaylist();
  }
  
  // ngAfterViewInit () {
  //   this.afs.playWhenReady(this.afs.instructions['lecturas']);
  // }


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
      .map(res => res.json())
      .subscribe(data => {
      
      console.log (data.items);
      // *** Get individual video data like comments, likes and viewCount. Enable this if you want it.
      // let newArray = data.items.map((entry) => {
      //   let videoUrl = 'https://www.googleapis.com/youtube/v3/videos?part=id,snippet,contentDetails,statistics&id=' + entry.id.videoId + '&key=' + this.googleAPIKey;
      //   this.http.get(videoUrl).map(videoRes => videoRes.json()).subscribe(videoData => {
      //     console.log (videoData);
      //     this.posts = this.posts.concat(videoData.items);
      //     return entry.extra = videoData.items;
      //   });
      // });
      this.videos = this.videos.concat(data.items);
    });
  }

  openItem(video: any) {
    this.navCtrl.push(VideoPlayerPage, {
      video: video
    });
  }

  volver() {
    this.afs.playPause(this.afs.homePageButtons);
    this.navCtrl.pop();
  }

}

