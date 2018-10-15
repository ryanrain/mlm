// CORE
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
// CORDOVA PLUGINS
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
// IONIC
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
// SERVICES
import { AudioFileService } from '../building.blocks/audio.file.service';
import { Maguito } from '../building.blocks/maguito.component';
import { WindowTokenModule } from '../building.blocks/window';
// LANGUAGE CONTENT
import { AlfabetoCastillano } from '../castillano/alfabeto.castillano';
import { PalabrasCastillano } from '../castillano/palabras.castillano';
import { SilabasCastillano } from '../castillano/silabas.castillano';
import { Bloques } from '../pages/bloques/bloques';
import { ElegirImagen } from '../pages/elegirImagen/elegirImagen';
import { HomePage } from '../pages/home/home';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
import { Lectura } from '../pages/lectura/lectura';
import { LecturasContent } from '../pages/lectura/lecturas.content';
import { Matching } from '../pages/matching/matching';
// import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
// APP
import { MyApp } from './app.component';




// import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

// const cloudSettings: CloudSettings = {
//   'core': {
//     'app_id': '90d21b23'
//   }
// };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ElegirImagen,
    Bloques,
    Matching,
    Lectura,
    ItemDetailPage,
    Maguito
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    // CloudModule.forRoot(cloudSettings),
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
    ItemDetailPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AlfabetoCastillano,
    SilabasCastillano,
    PalabrasCastillano,
    LecturasContent,
    AudioFileService,
    InAppBrowser,
    Network,
    SplashScreen,
    StatusBar,
    // FirebaseAnalytics
  ]
})
export class AppModule { }