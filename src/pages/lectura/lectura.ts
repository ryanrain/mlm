import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { LecturaModel } from '../../models/lectura.model';
import { LecturasContent } from './lecturas.content';
import { ItemDetailPage } from '../item-detail/item-detail';

@Component({
  selector: 'lecturas',
  template: `
    <ion-header>
      <button ion-button icon-only (click)="volver()">
        <ion-icon name="home"></ion-icon>
      </button>
      <ion-title>Lecturas</ion-title>
    </ion-header>

    <ion-content padding>
      <div id="lecturas-list">
        <div *ngFor="let lectura of lecturas.lecturas" (click)="openItem(lectura)">
          <img src="assets/lecturas/{{lectura.img}}">
          <h5>{{lectura.title}}</h5>
        </div>
      </div>
    </ion-content>
  `
})
export class Lectura {

  constructor (
    public navCtrl: NavController,
    public lecturas: LecturasContent
      ) {
  }

  openItem(lectura: LecturaModel) {
    this.navCtrl.push(ItemDetailPage, {
      lectura: lectura
    });
  }

  volver() {
    this.navCtrl.pop();
  }

}
