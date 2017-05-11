import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LecturaModel } from '../../models/lectura.model';
import { LecturasContent } from '../lectura/lecturas.content';

@Component({
  selector: 'page-item-detail',
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>{{ lectura.title }}</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content padding>

      <div class="item-profile" text-center [style.background-image]="'url(assets/lecturas/' + lectura.img + ')'"></div>

      <h1>{{lectura.title}}</h1>
      <div class="story-text" [innerHTML]="lectura.text"></div>
      <p>&nbsp;</p>
      
      <h1>Contesta las siguientes preguntas</h1>

      <div *ngFor="let pregunta of lectura.preguntas; let i = index;" 
        [ngClass]="{
          'correct': (answersGiven[i] === pregunta.respuestaCorrecta) && hitFinished,
          'incorrect': !(answersGiven[i] === pregunta.respuestaCorrecta) && hitFinished
          }"
          >
        <div class="muybien" *ngIf="(answersGiven[i] === pregunta.respuestaCorrecta) && hitFinished">Muy Bien!</div>
        <div class="muybien" *ngIf="!(answersGiven[i] === pregunta.respuestaCorrecta) && hitFinished">Revisa el texto nuevamente</div>
        <ion-list padding radio-group [(ngModel)]="answersGiven[i]">
          <p>{{pregunta.pregunta}}</p>
          <ion-item>
            <ion-label>{{pregunta.respuesta1}}</ion-label>
            <ion-radio value="{{pregunta.respuesta1}}"></ion-radio>
          </ion-item>
          <ion-item>
            <ion-label>{{pregunta.respuesta2}}</ion-label>
            <ion-radio value="{{pregunta.respuesta2}}"></ion-radio>
          </ion-item>
          <ion-item>
            <ion-label>{{pregunta.respuesta3}}</ion-label>
            <ion-radio value="{{pregunta.respuesta3}}"></ion-radio>
          </ion-item>
        </ion-list>
      </div>

      <button ion-button round (click)="checkAnswers()">{{buttonText}}</button>       

    </ion-content>
  `
})
export class ItemDetailPage {
  lectura: LecturaModel;
  lecturas: LecturasContent;
  answersGiven = [];
  buttonText = 'LISTO';
  hitFinished = false;

  constructor(public navCtrl: NavController, navParams: NavParams) {
    this.lectura = navParams.get('lectura');
    this.lecturas = navParams.get('lecturas');
    
    console.log(this.lecturas);

    this.lectura.preguntas.forEach((pregunta) => {
      this.answersGiven.push(null);
    });

  }

  checkAnswers() {
    if ( this.hitFinished ) {
      // let currentLectura = this.lecturas.
      console.log(this.lecturas.lecturas);
      
      this.navCtrl.pop();
    }

    // this.buttonText = 'Siguiente Lectura';
    this.buttonText = 'Volver';
    
    this.hitFinished = true;
  }

}