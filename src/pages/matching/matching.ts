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
      <div *ngFor="let word of wordsText"><span #words [attr.data-word]="word">{{word}}</span></div>
    </div>
    <div id="images">
      <div *ngFor="let word of words">
        <img #images src="assets/imagenes/{{word}}.png" [attr.data-word]="word">
      </div>      
    </div>
    <canvas id="lines"></canvas>
  </ion-content>
  <div style="display:none;" class="preloader">
  </div>
  `
})
export class Matching implements AfterViewInit {

  words:String[];
  wordsText:String[];
  wordAttempted:String = '';
  imgOrText:String = '';

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
        console.log(clickEvent);
        
        let currentAttempt = clickEvent.target.getAttribute("data-word"),
            currentImgOrText = clickEvent.target.nodeName;

        console.log(this.wordAttempted, currentAttempt, currentImgOrText);

        // if none are selected
        if ( this.wordAttempted === '' ) {
          this.wordAttempted = currentAttempt;
          this.imgOrText = currentImgOrText;
          clickEvent.target.classList.add('selected');
          console.log('if none are selected');
          return;
        }

        // if click the same thing a second time
        if ( this.wordAttempted === currentAttempt && this.imgOrText === currentImgOrText ) {
          this.deselectAll();
          console.log('if click the same thing a second time');          
        }

        // if one has been selected already
        if ( this.wordAttempted !== '' ) {
          console.log('if one has been selected already');
          clickEvent.target.classList.add('selected');
          setTimeout(function() {    
            if ( this.wordAttempted === currentAttempt ) {
              console.log('if the next one is correct');
              this.audioChing.play();
              // draw a straight line 
              
              // make those no longer clickable
              this.deselectAll();
            } else {
              console.log('incorrect');
              this.deselectAll();
            }
          }.bind(this), 250);
        }



      }
    );
  }

  deselectAll() {
    this.wordAttempted = '';
    this.imgOrText = '';
    this.clickables.forEach(elementRef => {
      elementRef.nativeElement.classList.remove('selected');
    });
  }

  drawLine(){
    /**
     * first assemble a nodelist .filter with hasClass('selected')
     * create a div
     * set it's   
     */
      // var canvas = document.getElementById('myCanvas');
      // var context = canvas.getContext('2d');

      // context.beginPath();
      // context.moveTo(100, 150);
      // context.lineTo(450, 50);
      // context.lineWidth = 10;

      // // set line color
      // context.strokeStyle = '#ff0000';
      // context.stroke();
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
