import { Component, ViewChild, ViewChildren, AfterViewInit, QueryList, ElementRef, HostListener } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/throttleTime';

import { NavController, Content } from 'ionic-angular';

import { PalabrasCastillano } from '../../alfabetos/palabras.castillano';

@Component({
  selector: 'matching-game',
  template: `
  <button class="nav-button" (click)="volver()"><ion-icon name="home"></ion-icon></button>
  <button class="nav-button refresh" (click)="reset()"><ion-icon name="refresh"></ion-icon></button>

  <ion-content padding>
    <svg #lines id="lines" viewBox="0 0 320 600"></svg>
    <div id="words">
      <div *ngFor="let word of wordsText"><span #words [attr.data-word]="word" [class]="word">{{word}}</span></div>
    </div>
    <div id="images">
      <div *ngFor="let word of words">
        <img #images [class]="word" src="assets/imagenes/{{word}}.png" [attr.data-word]="word">
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
  wordAttempted:String = '';
  imgOrText:String = '';
  numberCorrectSoFar:Number = 0;
  notYetRun:boolean;

  audioChing = new Audio('/assets/ching.mp3');

  @ViewChildren('words, images') clickables:QueryList<ElementRef>;
  @ViewChild('lines') lines:ElementRef;
  attempts:Observable<any>;
  attemptsSubscription;
  @ViewChild(Content) content: Content;


  constructor(
    public navCtrl: NavController,
    public castillano: PalabrasCastillano,
      ) {
      this.createWords();
  }

  ngAfterViewInit() {

    this.setSvgViewbox();

    this.clickables.changes.subscribe(buttons => {
      this.makeButtonsClickable(buttons);
    });

    this.makeButtonsClickable(this.clickables); // first run
  }

  makeButtonsClickable(buttons:QueryList<ElementRef>) {
    
    // loop through QueryList and return a single Observable of events
    buttons.reduce( (acc, boton) => {
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

    // fix bug where words that re-appear in subsequent random selection have double action, immediately unselecting. also possible memory savings?
    if ( typeof(this.attemptsSubscription) === 'object' ) {
      this.attemptsSubscription.unsubscribe();
    }

    // act on taps
    this.attemptsSubscription = this.attempts
      .throttleTime(300)    
      .subscribe(clickEvent => {
        
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
          return;        
        }

        // if one has been selected already
        if ( this.wordAttempted !== '' ) {
          console.log('if one has been selected already');
          clickEvent.target.classList.add('selected');
          setTimeout(function() {    
            if ( this.wordAttempted === currentAttempt ) {
              console.log('if the next one is correct');
              this.numberCorrectSoFar++;
              this.audioChing.play();
              this.drawLine(clickEvent.target);              
              this.deselectAll();
              if(this.numberCorrectSoFar === 5) {
                setTimeout(()=>{
                  this.celebrate();
                },2000);
              }
            } else {
              console.log('incorrect');
              this.deselectAll();
            }
          }.bind(this), 250);
        }
      }
    );
  }

  setSvgViewbox() {
    let width = this.content.getContentDimensions().contentWidth;
    let height = this.content.getNativeElement().offsetHeight;
    this.lines.nativeElement.setAttribute("viewBox", '0 0 ' + width + ' ' + height);
  }

  drawLine(target:any){

    let leftOffsetOfMostRecent, topOffsetOfMostRecent, leftOffsetOfOtherSelected, topOffsetOfOtherSelected;

    // find the other selected item
    let otherSelected = this.clickables.filter(item => {
      if ( item.nativeElement.classList.contains('selected') && item.nativeElement.nodeName !== target.nodeName) {
        return true;
      }
    })[0].nativeElement;

    if (target.nodeName === 'SPAN') {
      leftOffsetOfMostRecent = target.offsetWidth + 8; // .5em padding
      leftOffsetOfOtherSelected = otherSelected.offsetParent.offsetLeft + otherSelected.offsetParent.offsetWidth - otherSelected.offsetWidth;
    } else {
      leftOffsetOfMostRecent = target.offsetParent.offsetLeft + target.offsetParent.offsetWidth - target.offsetWidth;
      leftOffsetOfOtherSelected = otherSelected.offsetWidth + 8; // .5em padding
    }
    topOffsetOfMostRecent = target.offsetTop + (target.offsetHeight / 2)
    topOffsetOfOtherSelected = otherSelected.offsetTop + (otherSelected.offsetHeight / 2)
    

    console.log(otherSelected);
    otherSelected.nativeElement

    let newpath = document.createElementNS('http://www.w3.org/2000/svg',"path"); 
    newpath.setAttribute('d', 'M ' + leftOffsetOfMostRecent + ',' + topOffsetOfMostRecent + ',L' + leftOffsetOfOtherSelected + ',' + topOffsetOfOtherSelected);

    this.lines.nativeElement.appendChild(newpath);

    // remove correctly linked items selectability
    otherSelected.style.zIndex = '-1';
    target.style.zIndex = '-1';
  }

  findOtherSelected(list:QueryList<ElementRef>, targetNodeName:string) {
    return list.filter(item => {
      if ( item.nativeElement.classList.contains('selected') && item.nativeElement.nodeName !== targetNodeName) {
        return true;
      }
    });
  }

  deselectAll() {
    this.wordAttempted = '';
    this.imgOrText = '';
    this.clickables.forEach(elementRef => {
      elementRef.nativeElement.classList.remove('selected');
    });
  }

  createWords(){
    this.words = this.shuffle(this.castillano.words).slice(0,5);
    this.wordsText = this.shuffle(this.words.slice());
  }

  celebrate() {
    this.audioChing.play();
    this.reset();
  }

  reset() {
    // erase all lines
    while (this.lines.nativeElement.firstChild) {
        this.lines.nativeElement.removeChild(this.lines.nativeElement.firstChild);
    }
    this.createWords();
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

  @HostListener('window:resize', ['$event'])
  onResize(){

    console.log(this.notYetRun);
    // debounced resize
    if ( this.notYetRun === true || typeof(this.notYetRun) === 'undefined') {
      this.reset();
      this.setSvgViewbox();
      this.notYetRun = false;
      setTimeout(()=>{
        this.notYetRun = true;
      }, 1000); 
    }

  }
}
