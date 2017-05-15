import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

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

import { AudioFileService } from '../services/audio.file.service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ElegirImagen,
    Bloques,
    Matching,
    Lectura,
    ItemDetailPage, 
  ],
  imports: [
    IonicModule.forRoot(MyApp)
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
