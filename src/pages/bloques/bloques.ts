import { Component, ViewChild, ViewChildren, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/zip';

import {interact} from 'interactjs';

import { SilabasCastillano } from '../../silabas/silabas.castillano';

@Component({
  selector: 'bloques',
  // templateUrl: 'bloques.html',
  template: `
  <button class="volver" (click)="volver()"><ion-icon name="home"></ion-icon></button>

  <ion-content [ngClass]="{woohoo:(woohoo) }" #ionContentRef>

    <ion-row class="row lugares">
      <ion-col class="lugar">
        <div #droppable1 class="droppable first"></div>
      </ion-col>
      <ion-col class="lugar">
        <div #droppable2 class="droppable second"></div>
      </ion-col>
    </ion-row>

    <div #blockArea class="block-area">
      <div 
        #blocks 
        *ngFor="let silaba of silables" class="cubo">
        {{silaba}}
      </div>
    </div>

  </ion-content>
  `
})

export class Bloques implements AfterViewInit {

  woohoo:boolean = false;
  randomSilables:string[];
  word = ['','']
  silables = [];
  
  @ViewChildren('blocks') blocksQueryList:QueryList<ElementRef>;
  @ViewChildren('droppable1, droppable2') zonasDroppables:QueryList<ElementRef>;
  @ViewChild('blockArea') blockArea:ElementRef;

  constructor(
    public navCtrl: NavController,
    public castillano: SilabasCastillano
  ) {
    this.crearSilabas();
  }
 
  ngAfterViewInit () {
    this.scatterBlocks();
    this.makeBlocksDraggable();
    this.createDropZones();
  }

  scatterBlocks() {
    let blockAreaOffset = this.blockArea.nativeElement.offsetTop,
        blockAreaHeight = this.blockArea.nativeElement.offsetHeight,
        blockWidth = this.blockArea.nativeElement.offsetWidth / 4; // 25% width set in scss

    this.blocksQueryList.forEach( cubo => {
      let top = Math.round( Math.random() * (blockAreaHeight - blockWidth) ) + blockAreaOffset,
          left = Math.round( Math.random() * (this.blockArea.nativeElement.offsetWidth - blockWidth) );
    
      cubo.nativeElement.style.left = left + 'px';
      cubo.nativeElement.style.top = top + 'px';
      cubo.nativeElement.setAttribute('data-x', left);
      cubo.nativeElement.setAttribute('data-y', top);
      
    });
  }

  makeBlocksDraggable() {

    interact.maxInteractions(Infinity);
    
    // make blocks draggable
    this.blocksQueryList.forEach( cubo => {
      interact(cubo.nativeElement)
        .draggable({ max: Infinity })
        .on('dragstart', function (event) {
            event.interaction.x = parseInt(event.target.getAttribute('data-x'), 10) || 0;
            event.interaction.y = parseInt(event.target.getAttribute('data-y'), 10) || 0;
        })
        .on('dragmove', function (event) {
            event.interaction.x += event.dx;
            event.interaction.y += event.dy;
            event.target.style.left = event.interaction.x + 'px';
            event.target.style.top  = event.interaction.y + 'px';
        })
        .on('dragend', function (event) {
            event.target.setAttribute('data-x', event.interaction.x);
            event.target.setAttribute('data-y', event.interaction.y);
        });
    });
  }

  createDropZones(){
    // enable draggables to be dropped into this
    this.zonasDroppables.toArray().forEach(function (droppable) {

      interact(droppable.nativeElement).dropzone({

        // Require a 50% element overlap for a drop to be possible
        overlap: 0.5,

        // listen for drop related events:

        ondropactivate: event => {
          // add active dropzone feedback
          event.target.classList.add('drop-active');
        },
        ondragenter: function (event) {
          var draggableElement = event.relatedTarget,
              dropzoneElement = event.target;

          // feedback the possibility of a drop
          dropzoneElement.classList.add('drop-target');
          draggableElement.classList.add('can-drop');
          draggableElement.textContent = 'Dragged in';
        },
        ondragleave: function (event) {
          // remove the drop feedback style
          event.target.classList.remove('drop-target');
          event.relatedTarget.classList.remove('can-drop');
          event.relatedTarget.textContent = 'Dragged out';
          
          //  TODO: if dragged out remove from this.word
          // quitarDeLugares(silaba:string) {

        },
        ondrop: event => {
          // event.relatedTarget.textContent = 'Dropped';
          this.alLugar(event);    
        },
        ondropdeactivate: function (event) {
          // remove active dropzone feedback
          event.target.classList.remove('drop-active');
          event.target.classList.remove('drop-target');
        }
      });
    }, this)
  }

  alLugar(event) {

    // snap into middle of target
    let top = event.target.offsetParent.offsetTop + event.target.offsetTop + 
      ((event.target.offsetHeight - event.relatedTarget.offsetHeight) / 2),
        left = event.target.offsetParent.offsetLeft + event.target.offsetLeft + 
      ((event.target.offsetWidth - event.relatedTarget.offsetWidth) / 2);

    event.relatedTarget.style.top = top + 'px';
    event.relatedTarget.style.left = left + 'px';

    // set data-x attributes *after* dragend event
    setTimeout(() => {
      event.relatedTarget.setAttribute('data-y', top);
      event.relatedTarget.setAttribute('data-x', left);
    }, 10);

    // this
    //  if cubito already in dropzone, prevent further dropping
    console.log(event);
  }

/*
if (adentroLugar(lugar:{}, currentLocation:{})) {
  add new silaba string to lugar observable
}
.zip(lugar1, lugar2){
  [lugar1, lugar2].toString()
}
.subscribe(combinedFullWords) {
  if(palabrasCastillano:string[].indexOf(combinedFullWords){
    woohooitsaword(index);
    crearSilabas();
  }
}
*/

  quitarDeLugares(silaba:string) {
    console.log(silaba + ' dropped outside');
    if(this.word.indexOf(silaba) >= 0) {
      this.word[this.word.indexOf(silaba)] = '';
    }
    console.log(this.word);    
  }

  crearSilabas(){
    this.woohoo = false;
    this.randomSilables = this.shuffle(this.castillano.listaSilabas);
    this.silables = this.randomSilables.slice(0,7);
  }

  esPalabra(eleccion1:string, eleccion2:string):boolean {
    // console.log(eleccion);
    return false;
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