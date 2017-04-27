import { Component, ViewChildren, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/throttleTime';

import { NavController } from 'ionic-angular';

import { PalabrasCastillano } from '../../alfabetos/palabras.castillano';

@Component({
  selector: 'matching-game',
  template: `
  <button class="nav-button" (click)="volver()"><ion-icon name="home"></ion-icon></button>
  <button class="nav-button refresh" (click)="createWords()"><ion-icon name="refresh"></ion-icon></button>

  <ion-content padding>
    <div id="words">
      <div #words *ngFor="let word of wordsText"><span [attr.data-word]="word">{{word}}</span></div>
    </div>
    <div id="images">
      <div #images *ngFor="let word of words">
        <img src="assets/imagenes/{{word}}.png" [attr.data-word]="word">
      </div>      
    </div>
  </ion-content>
  <div style="display:none;" class="preloader">
  </div>
  `
})
export class Matching implements AfterViewInit {

  words:String[];
  wordsText:String[];
  wordAttempted:String;

  audioChing = new Audio('/assets/ching.mp3');

  @ViewChildren('words, images') clickables:QueryList<ElementRef>;
  attempts:Observable<any>;

  constructor(
    public navCtrl: NavController,
    public castillano: PalabrasCastillano
      ) {
      this.createWords();
  }

  ngAfterViewInit() {
    
    // loop through QueryList and return a single Observable of events
    this.clickables.reduce( (acc, boton) => {
        let current = Observable.fromEvent(boton.nativeElement, 'click');
        if ( acc === null) {
          // console.log('first run');
          return current;
        } 
        // console.log('subsequent');
        this.attempts = acc.merge(current);
        return this.attempts;
      },
      null
    );

    // act on taps
    this.attempts
      .throttleTime(300)    
      .subscribe(clickEvent => {
        // console.log(clickEvent.target.attributes[0].nodeValue);

        this.wordAttempted = clickEvent.target.getAttribute("data-word");
        this.audioChing.play();
        console.log(this.wordAttempted);

        if( this.wordAttempted === 'this.letraAhora' ) {

        }
      })
    ;
  }

  createWords(){
    this.words = this.shuffle(this.castillano.words).slice(0,5);
    this.wordsText = this.shuffle(this.words.slice());
  }

  reset() {
  }

  shuffle(array)
  {
    var m = array.length, t, i;
    while (m > 0) 
    {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    }
    return array;
  }

  volver() {
    this.navCtrl.pop();
  }

}
