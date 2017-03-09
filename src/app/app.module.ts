import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ElegirImagen } from '../pages/elegirImagen/elegirImagen';
import { Castillano } from '../alfabetos/castillano';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ElegirImagen
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ElegirImagen
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Castillano]
})
export class AppModule {}
