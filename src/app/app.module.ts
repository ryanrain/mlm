import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ElegirImagen } from '../pages/elegirImagen/elegirImagen';
import { Bloques } from '../pages/bloques/bloques';
import { Matching } from '../pages/matching/matching';
import { Lectura } from '../pages/lectura/lectura';
import { ItemDetailPage } from '../pages/item-detail/item-detail';

import { AlfabetoCastillano } from '../castillano/alfabeto.castillano';
import { PalabrasCastillano } from '../castillano/palabras.castillano';
import { SilabasCastillano } from '../castillano/silabas.castillano';
import { LecturasContent } from '../pages/lectura/lecturas.content';

import { AudioFileService } from '../building.blocks/audio.file.service';
import { Maguito } from '../building.blocks/maguito.component';

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
    Maguito
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
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
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
    AlfabetoCastillano, 
    SilabasCastillano,
    PalabrasCastillano,
    LecturasContent,
    AudioFileService
  ]
})
export class AppModule {}