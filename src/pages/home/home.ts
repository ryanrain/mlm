import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import { NavController, AlertController, Platform } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/zip";

import { ElegirImagen } from "../elegirImagen/elegirImagen";
import { Bloques } from "../bloques/bloques";
import { Matching } from "../matching/matching";
import { Lectura } from "../lectura/lectura";
import { Videos } from "../videos/videos";

import { AudioFileService } from "../../building.blocks/audio.file.service";
import { Maguito } from "../../building.blocks/maguito.component";

import { InAppBrowser } from "@ionic-native/in-app-browser";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
// import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

@Component({
  selector: "page-home",
  // templateUrl: 'home.html'
  template: `
    <div *ngIf="afs.isWeb && !allLoadedBool" id="loading">
      <img id="loader-circle" src="assets/maguito/loader.gif">
      <maguito></maguito>
    </div>
    <ion-content padding>
      <button class="nav-button volume" (click)="afs.playPauseBackgroundMusic()">
        <span *ngIf="!afs.backgroundMusicHowl.playing()"  id="music-off">\\\</span>
        <ion-icon name="musical-notes"></ion-icon>
      </button>
      <div id="home-container" [class.show-content]="isMobileWeb || showContentBool">
        <img #bgImg class="bg-img" src="assets/fondos/FONDO4.jpg">
        <div id="mlm"><img src="assets/home/mlm.png"></div>
        <div id="menu-buttons">
          <div class="home-button" *ngFor="let p of pages" (click)="openPage(p)" [attr.data-audio]="p.audioFileName">{{p.title}}</div>
        </div>
        <div id="maguito-menu">
          <a (click)="openLink($event)" class="home-button" target="_blank" href="http://milibromagico.com.mx/">Sitio web</a>
          <a (click)="openLink($event)" class="home-button" target="_blank" href="https://www.youtube.com/channel/UCg9rOiFz4riAK-P-nkS4r7g">Videos</a>
          <a (click)="openLink($event)" class="home-button" target="_blank" href="http://milibromagico.com.mx/index.php/tienda-en-linea">Tienda <br>en linea</a>
          <maguito [class.maguitohidden]="!showContentBool"></maguito>
        </div>
      </div>
      <div *ngIf="isCore" #entradaContainer id="entrada-container" [class.entrada-fade-out]="showContentBool">
        <video #entradaVideo id="entrada" preload="auto" src="assets/home/entrada.mp4"></video>
      </div>
      <span id="creditos" (click)="openCredits()">Creditos</span>
    </ion-content>
  `
})
export class HomePage implements AfterViewInit {
  pages: any[] = [
    {
      title: "Letras",
      audioFileName: "letras",
      component: ElegirImagen
    },
    {
      title: "Bloques",
      audioFileName: "bloques",
      component: Bloques
    },
    {
      title: "Pares",
      audioFileName: "pares",
      component: Matching
    },
    {
      title: "Lecturas de Comprensión",
      audioFileName: "lecturas",
      component: Lectura
    },
    {
      title: "Video Cuentos",
      audioFileName: "videocuentos",
      component: Videos
    }
  ];

  isMobileWeb: boolean;
  isCore: boolean;
  @ViewChild("bgImg") bgImg: ElementRef;
  bgLoaded: Observable<any>;
  @ViewChild("entradaContainer") entradaContainer: ElementRef;
  entradaLoaded: Observable<any>;
  @ViewChild("entradaVideo") entradaVideo: ElementRef;
  entradaVideoLoaded: Observable<any>;
  backgroundMusicLoaded: Observable<any>;
  allLoaded: Observable<any>;
  allLoadedBool: boolean = false;
  showContentBool: boolean = false;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public afs: AudioFileService,
    private alertCtrl: AlertController,
    private iab: InAppBrowser,
    private change: ChangeDetectorRef,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen
  ) // private firebaseAnalytics: FirebaseAnalytics
  {
    this.isMobileWeb = platform.is("mobileweb"); // for redundant use in template
    this.isCore = platform.is("core");
  }

  ngAfterViewInit() {
    //
    // LOADING LOGIC
    //

    // CORDOVA
    // if viewed as installed app
    if (this.platform.is("cordova")) {
      this.allLoadedBool = true; // redundant
      // this.startEntrada(); // no longer - can't load videos as a part of app without fancy dynamic load to sd card
      this.showContent();
      this.change.detectChanges();

      this.backgroundMusicLoaded = Observable.fromEvent(
        this.afs.backgroundMusicHowl,
        "load"
      );
      this.backgroundMusicLoaded.subscribe(event => {
        this.platform.ready().then(() => {
          // play music
          this.afs.appHowl.play("miLibroMagico");
          // then start the background music
          this.afs.appHowl.once("end", () => {
            this.afs.playPauseBackgroundMusic();
            this.change.detectChanges();
          });
          this.statusBar.styleDefault();
          this.splashScreen.hide();

          // this.firebaseAnalytics.setCurrentScreen('inicio')
          //   .then((res: any) => console.log(res))
          //   .catch((error: any) => console.error(error));
        });
      });
    }

    // MOBILEWEB
    // if viewed in a browser on a mobile device, skip the video but wait for bg load.
    if (this.platform.is("mobileweb")) {
      // watch for background image load
      this.bgLoaded = Observable.fromEvent(this.bgImg.nativeElement, "load");

      // don't show entrada video
      this.bgLoaded.subscribe(() => {
        // remove loading
        this.allLoadedBool = true;
        // hide entrada video, show maguito below
        this.showContent();
        console.log("allLoaded mobileweb");
      });
    }

    // LARGE-SCREEN WEB
    // if viewed in web browser on conventional computer,
    // wait for the background, video, and background music
    if (this.platform.is("core")) {
      // watch for background image load event
      this.bgLoaded = Observable.fromEvent(this.bgImg.nativeElement, "load");

      // watch for video load event
      this.entradaVideoLoaded = Observable.fromEvent(
        this.entradaVideo.nativeElement,
        "canplaythrough"
      );

      // watch for background music load event
      this.backgroundMusicLoaded = Observable.fromEvent(
        this.afs.backgroundMusicHowl,
        "load"
      ); // usable here since will only load once.

      // all together
      this.allLoaded = Observable.zip(
        this.bgLoaded,
        this.entradaVideoLoaded,
        this.backgroundMusicLoaded
      );

      // and act on it.
      this.allLoaded.subscribe(status => {
        this.allLoadedBool = true;
        this.change.detectChanges();
        this.startEntrada();
        console.log("allLoaded");
      });

      // when entradaVideo finishes, hide entrada video, show maguito below
      this.entradaVideo.nativeElement.addEventListener("ended", () => {
        this.showContent();
        // play music
        this.afs.playPauseBackgroundMusic();
      });
    }
  }

  startEntrada() {
    this.entradaVideo.nativeElement.play();
  }

  showContent() {
    this.showContentBool = true;
    if (this.isCore) {
      setTimeout(() => {
        this.entradaContainer.nativeElement.style.display = "none";
      }, 1000);
    }
  }

  openPage(page) {
    this.afs.appHowl.play(page.audioFileName);
    this.navCtrl.push(page.component);
    // if (this.platform.is('cordova')) {
    //   this.platform.ready().then(() => {
    //     this.firebaseAnalytics.setCurrentScreen(page.title)
    //       .then((res: any) => console.log(res))
    //       .catch((error: any) => console.error(error));
    //   });
    // }
  }

  openCredits() {
    let alert = this.alertCtrl.create({
      title: "Creditos",
      message:
        '<p>Applicación por Bikit Puy Comunicación y Diseño. <br>Contacto: <a href="mailto:bikitpuy@gmail.com">bikitpuy@gmail.com</a></p><p>"Happy Bee - Surf" Kevin MacLeod (incompetech.com)<br>Con licencia <a href="http://creativecommons.org/licenses/by/3.0/">Creative Commons 3.0</a></p>',
      cssClass: "creditos-alert",
      buttons: [
        {
          text: " ",
          role: "cancel",
          cssClass: "cerrar-creditos"
        }
      ]
    });
    alert.present();
  }

  openLink(event) {
    if (this.platform.is("cordova")) {
      event.preventDefault();
      this.iab.create(event.target.href, "system");
    }
  }
}
