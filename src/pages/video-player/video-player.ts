import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AudioFileService } from '../../building.blocks/audio.file.service';


@Component({
  selector: 'page-video-player',
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>{{ video.snippet.title }}</ion-title>
        <button class="nav-button volume" (click)="afs.playPauseBackgroundMusic()">
          <span *ngIf="!afs.backgroundMusicHowl.playing()"  id="music-off">\\\</span>
          <ion-icon name="musical-notes"></ion-icon>
        </button>
      </ion-navbar>
    </ion-header>

    <ion-content>

      <youtube-player 
        [videoId]="video.snippet.resourceId.videoId" 
        (ready)="savePlayer($event)"
        (change)="onStateChange($event)"
      >
      </youtube-player>

    </ion-content>
  `
})
export class VideoPlayerPage {

  video:any;
  private player;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afs: AudioFileService ) {

    // turn off music
    if (this.afs.backgroundMusicHowl.playing()) {
        this.afs.backgroundMusicHowl.pause();
    }

    this.video = navParams.get('video');
  }

  playVideo() {
    this.player.playVideo();
  }
  
  savePlayer(player) {
    this.player = player;
    this.playVideo();
  }
  
  onStateChange(event) {
    console.log(event.data);
  }

}