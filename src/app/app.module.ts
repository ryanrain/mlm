import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ElegirImagen } from '../pages/elegirImagen/elegirImagen';
import { Bloques } from '../pages/bloques/bloques';
import { AlfabetoCastillano } from '../alfabetos/alfabeto.castillano';
import { SilabasCastillano } from '../silabas/silabas.castillano';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ElegirImagen,
    Bloques
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ElegirImagen,
    Bloques
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
    AlfabetoCastillano, 
    SilabasCastillano
  ]
})
export class AppModule {}
