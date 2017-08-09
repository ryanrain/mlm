import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AudioFileService } from '../../building.blocks/audio.file.service';


@Component({
  selector: 'page-video-player',
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>{{ video.snippet.title }}</ion-title>
      </ion-navbar>
      <button class="nav-button volume" (click)="afs.playPauseBackgroundMusic()">
        <span *ngIf="!afs.backgroundMusicPlaying"  id="music-off">\\\</span>
        <ion-icon name="musical-notes"></ion-icon>
      </button>
    </ion-header>

    <ion-content>

      <img *ngIf="!ready" id="loader-circle" src="assets/maguito/loader.gif">
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

  ready:boolean = false;
  video:any;
  private player;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afs: AudioFileService ) {

    // turn off music
    this.pauseMusic();

    this.video = navParams.get('video');
  }

  pauseMusic() {
    if (this.afs.backgroundMusicHowl.playing()) {
        this.afs.backgroundMusicHowl.pause();
    }
  }

  playVideo() {
    this.player.playVideo();
  }
  
  savePlayer(player) {
    this.player = player;
    this.ready = true;
  }
  
  onStateChange(event) {
    console.log(event.data);
  }

}