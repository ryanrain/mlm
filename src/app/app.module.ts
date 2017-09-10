// CORE
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

// IONIC
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

// APP
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ElegirImagen } from '../pages/elegirImagen/elegirImagen';
import { Bloques } from '../pages/bloques/bloques';
import { Matching } from '../pages/matching/matching';
import { Lectura } from '../pages/lectura/lectura';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
import { Videos } from '../pages/videos/videos';
import { VideoPlayerPage } from '../pages/video-player/video-player';

// LANGUAGE CONTENT
import { AlfabetoCastillano } from '../castillano/alfabeto.castillano';
import { PalabrasCastillano } from '../castillano/palabras.castillano';
import { SilabasCastillano } from '../castillano/silabas.castillano';
import { LecturasContent } from '../pages/lectura/lecturas.content';

// SERVICES
import { AudioFileService } from '../building.blocks/audio.file.service';
import { Maguito } from '../building.blocks/maguito.component';
import { WindowTokenModule } from '../building.blocks/window';

// CORDOVA PLUGINS
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '90d21b23'
  }
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ElegirImagen,
    Bloques,
    Matching,
    Lectura,
    ItemDetailPage, 
    Maguito,
    Videos,
    VideoPlayerPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    CloudModule.forRoot(cloudSettings),
    HttpModule,
    WindowTokenModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ElegirImagen,
    Bloques,
    Matching,
    Lectura,
    ItemDetailPage,
    Videos,
    VideoPlayerPage
  ],  
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
    AlfabetoCastillano, 
    SilabasCastillano,
    PalabrasCastillano,
    LecturasContent,
    AudioFileService, 
    InAppBrowser,
    Network,
    SplashScreen,
    StatusBar
  ]
})
export class AppModule {}