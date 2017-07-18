import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-video-player',
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>{{ video.snippet.title }}</ion-title>
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
  private ytEvent;

  constructor(public navCtrl: NavController, navParams: NavParams ) {
    // turn off music
    this.video = navParams.get('video');
    console.log(this.video);
  }

  playVideo() {
    this.player.playVideo();
  }
  
  savePlayer(player) {
    this.player = player;
  }
  
  onStateChange(event) {
    console.log(event.data);
  }

}