import { Component, Inject, AfterViewInit } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AudioFileService } from '../../building.blocks/audio.file.service';
import { WINDOW } from '../../building.blocks/window';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

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

      <div [id]="'player' + this.video.snippet.resourceId.videoId"></div>

    </ion-content>
  `
})
export class VideoPlayerPage implements AfterViewInit {

  video:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afs: AudioFileService,
    public platform: Platform,     
    private firebaseAnalytics: FirebaseAnalytics,
    @Inject(WINDOW) public w: any
    ) {

    // turn off music
    if (this.afs.backgroundMusicHowl.playing()) {
        this.afs.backgroundMusicHowl.pause();
    }

    this.video = navParams.get('video');
    console.log(this.video);

    w.videoCuentoId = this.video.snippet.resourceId.videoId;

    // https://www.youtube.com/iframe_api
    if (!w['YT']) {
      w['YT'] = {loading: 0,loaded: 0};
    }
    if (!w['YTConfig']) {
      w['YTConfig'] = {'host': 'http://www.youtube.com'};
    }
    if (!w.YT.loading) {
      w.YT.loading = 1;
      (function(){
        var l = [];
        w.YT.ready = function(f) {
          if (w.YT.loaded) {
            f();
          } else {
            l.push(f);
          }
        };
        w.onYTReady = function() {
          w.YT.loaded = 1;
          for (var i = 0; i < l.length; i++) {
            try {l[i]();} 
            catch (e) {}
          }
        };
        w.YT.setConfig = function(c) {
          for (var k in c) {
            if (c.hasOwnProperty(k)) {
              w.YTConfig[k] = c[k];
            }
          }
        };
        var a = document.createElement('script');
        a.type = 'text/javascript';
        a.id = 'www-widgetapi-script';
        a.src = 'https://s.ytimg.com/yts/jsbin/www-widgetapi-vflQKB5wA/www-widgetapi.js';a.async = true;
        var b = document.getElementsByTagName('script')[0];
        b.parentNode.insertBefore(a, b);
      })();
    }

    // first run: create the function to be called upon API readiness, and load the vid
    if (!w.onYouTubeIframeAPIReady) {
      w.onYouTubeIframeAPIReady = function(){
        w['player' + w.videoCuentoId] = new w.YT.Player('player' + w.videoCuentoId, {
          events: {
            'onReady': w.onPlayerReady,
            'onStateChange': w.onPlayerStateChange
          }, 
          videoId: w.videoCuentoId
        });
        w.youTubeIframeAPIReady = true;
        console.log('first run: youtube iframe api ready!'); 
      }
    } 

    w.onPlayerReady = function(event){
      console.log(event);
      event.target.playVideo();
    }

    w.onPlayerStateChange = function(status){
      console.log(status.data);
    }  

    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.firebaseAnalytics.setCurrentScreen( 'video: ' + this.video.snippet.title )
          .then((res: any) => console.log(res))
          .catch((error: any) => console.error(error));
      });       
    }      

  }

  ngAfterViewInit() {

    // subsequent runs: create new player
    if (this.w.youTubeIframeAPIReady === true) {
      this.w['player' + this.w.videoCuentoId] = new this.w.YT.Player('player' + this.w.videoCuentoId, {
        events: {
          'onReady': this.w.onPlayerReady,
          'onStateChange': this.w.onPlayerStateChange
        }, 
        videoId: this.w.videoCuentoId
      });
      console.log('subsequent runs: update player');
    }
  }

}