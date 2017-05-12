import { Component, ViewChild, ViewChildren, AfterViewInit, QueryList, ElementRef, HostListener } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/zip';

import {interact} from 'interactjs';

import { SilabasCastillano } from '../../silabas/silabas.castillano';

@Component({
  selector: 'bloques',
  template: `
  <button class="nav-button home" (click)="volver()"><ion-icon name="home"></ion-icon></button>
  <button class="nav-button bulb" (click)="hint()"><ion-icon name="bulb"></ion-icon></button>
  <button class="nav-button refresh" (click)="newSilables()"><ion-icon name="refresh"></ion-icon></button>

  <ion-content [ngClass]="{woohoo:(woohoo) }">

    <img #bgImg class="bg-img" src="/assets/fondos/FONDO1.png">
        
    <div id="loading" *ngIf="!allLoadedBool">
      <img id="loader-circle" src="/assets/menu/loader.gif">
      <img #maguito id="maguito" src="/assets/menu/maguito.png">
    </div>
    
    <ion-row class="row lugares">
      <ion-col class="lugar">
        <div #droppable1 class="droppable" id="0"></div>
      </ion-col>
      <ion-col class="lugar">
        <div #droppable2 class="droppable" id="1"></div>
      </ion-col>
    </ion-row>

    <div #blockArea class="block-area">
      <div 
        #blocks 
        *ngFor="let silaba of silables" class="cubo">
        <span>{{silaba}}</span>
      </div>
    </div>
    
  </ion-content>
  <div style="display:none;" class="preloader">
    <img *ngFor="let color of blockColors" src="/assets/cubos/cubo{{color}}.png">
    <img [src]="wordImage">
  </div>
  `
})

export class Bloques implements AfterViewInit {

  woohoo:boolean = false;
  word = ['','']
  wordHint:string[];
  updatedCurrentBlocks;
  silables = [];

  silableAudios = {};
  bienAudios = {};
  audioChing = new Audio('/assets/ching.mp3');
  wordAudio;
  wordImage:string;
  
  blockColors = ['AMARILLO','AZUL','ROJO','VERDE'];
  activeDropZone:number;
  alreadyRefreshed: boolean = false;
  notYetRun: boolean;

  bgLoaded:Observable<any>;
  firstAudiosLoaded:Observable<any>;
  allLoaded:Observable<any>;
  allLoadedBool:boolean = false;
  
  maguitoClicks:Observable<any>;

  @ViewChildren('blocks') blocksQueryList:QueryList<ElementRef>;
  @ViewChildren('droppable1, droppable2') zonasDroppables:QueryList<ElementRef>;
  @ViewChild('blockArea') blockArea:ElementRef;
  @ViewChild('bgImg') bgImg:ElementRef;
  @ViewChild('maguito') maguito:ElementRef;

  wordStream:Subject<Array<string>> = new Subject();

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    public castillano: SilabasCastillano
  ) {
    this.createSilables();
    this.preloadWord(this.wordHint.join(''));
    this.preloadBienAudios();

    this.wordStream
      .filter(attempt => { 
        if (attempt.indexOf('') < 0) { // complete words only
          console.log( attempt );

          let inList:boolean = false;
          castillano.words.forEach( (wordInList:string[]) => {
            if ( attempt[0] === wordInList[0] && attempt[1] === wordInList[1] ){
              inList = true;
            }
          });
          
          if (!inList) {
            this.notAWord();
          } else {
            return true;
          }
        }
      })
      .subscribe(wordArray => {
        let successWord = wordArray.join('');
        this.wordImage = successWord;
        let successWordAudio = new Audio('assets/palabras/' + successWord + '.MP3')
        
        setTimeout(() => {
          this.playRandomBienAudio();
        },500);

        let alert = this.alertCtrl.create({
          title: successWord,
          message: '<img class="success-word" src="/assets/imagenes/' + successWord + '.png">',
          buttons: [
            {
              text: 'Siguente',
              role: 'cancel',
              cssClass: 'primary',
              handler: () => {
                this.newSilables();
                this.alreadyRefreshed = true;
              }
            }
          ]
        });
        setTimeout(() => {
          alert.present();
        }, 2000);
        setTimeout(() => {
          successWordAudio.play();
        }, 3000);
        setTimeout(() => {
          if(!this.alreadyRefreshed) {
            alert.dismiss();
            this.newSilables();
          }
        }, 6000);
      })
    ;

    // pre-load current silables
    this.silables.forEach(silable => {
      this.silableAudios[silable] = new Audio("assets/silabas/" + silable + '.MP3');
    })
  }
 
  ngAfterViewInit () {
    this.blocksQueryList.changes.subscribe(blocks => {
      this.scatterBlocks(blocks);
      this.updatedCurrentBlocks = blocks;
    });
    this.scatterBlocks(this.blocksQueryList); // no change event yet
    this.makeBlocksDraggable();
    this.createDropZones();

    this.bgLoaded = Observable.fromEvent(this.bgImg.nativeElement, 'load');
    this.firstAudiosLoaded = Observable.fromEvent(this.silableAudios[this.silables[this.silables.length - 1]], 'canplaythrough');
    this.allLoaded = Observable.zip(this.bgLoaded, this.firstAudiosLoaded);

    this.allLoaded.subscribe(array => {
      console.log('allLoaded');
      this.allLoadedBool = true;
      // now pre-load all silables
      this.castillano.silables.forEach(silable => {
        this.silableAudios[silable] = new Audio("assets/silabas/" + silable + '.MP3');
      })
    })

    this.maguitoClicks = Observable.fromEvent(this.maguito.nativeElement, 'click');
    this.maguitoClicks.subscribe(event => {
      this.audioChing.play();
    })

  }

  reset() {
    
    this.word = ['',''];
    this.woohoo = false;

    // remove active class from dropzones
    this.zonasDroppables.forEach((zona:ElementRef) => {
      zona.nativeElement.classList.remove('drop-target');
    })
  }

  createSilables(){

    // pick a random word
    this.wordHint = this.shuffle(this.castillano.words)[0];
    console.log('pista: ' + this.wordHint.join(''));

    // get list of remaining unused silables 
    let randomSilables:string[] = this.shuffle(this.castillano.silables)
      .filter(silable => {
        return silable !== this.wordHint[0] && silable !== this.wordHint[1];
      })
    ;

    this.silables = this.wordHint.concat( randomSilables.slice(0,3) );
    
    this.alreadyRefreshed = false;

  }

  newSilables() {
    this.reset();
    this.createSilables();
    this.preloadWord(this.wordHint.join(''));
  }
  
  preloadWord(word:string) {
    this.wordAudio = new Audio('assets/palabras/' + word + '.MP3');
    this.wordImage = "assets/imagenes/" + word + ".png";
  }

  
  preloadBienAudios(){
    ['0','1','2','3','4','5','6'].forEach(number => {
      this.bienAudios[number] = new Audio("assets/muybien/" + number + '.MP3');
    });
  }

  playRandomBienAudio(){
    let random = Math.round(Math.random() * 6.2);
    this.bienAudios[random.toString()].play();
  }

  hint(){
    let blocks:QueryList<ElementRef> = this.updatedCurrentBlocks || this.blocksQueryList;
    blocks.forEach(block => {
      if(this.wordHint.indexOf(block.nativeElement.innerText) >= 0) {
        block.nativeElement.classList.add('hint');
        setTimeout(() => {
          block.nativeElement.classList.remove('hint');          
        },1500);
      }
    });
  }

  scatterBlocks(blocks:QueryList<ElementRef>) {
    let blockAreaOffset = this.blockArea.nativeElement.offsetTop,
        blockAreaHeight = this.blockArea.nativeElement.offsetHeight,
        blockWidth = this.blockArea.nativeElement.offsetWidth / 4; // 25% width set in scss

    blocks.forEach( cubo => {

      let top = Math.round( Math.random() * (blockAreaHeight - blockWidth) ) + blockAreaOffset,
          left = Math.round( Math.random() * (this.blockArea.nativeElement.offsetWidth - blockWidth) );
    
      cubo.nativeElement.style.left = left + 'px';
      cubo.nativeElement.style.top = top + 'px';
      cubo.nativeElement.setAttribute('data-x', left);
      cubo.nativeElement.setAttribute('data-y', top);

      // set random block color
      cubo.nativeElement.style.backgroundImage
       = 'url("/assets/cubos/cubo' + this.shuffle(this.blockColors)[0] + '.png")';

      cubo.nativeElement.classList.remove('currently-placed-block');
    });
  }

  makeBlocksDraggable() {

    interact.maxInteractions(Infinity);
    let blockZIndex = 1;
    let silableAudios = this.silableAudios;
    
    interact('.cubo', { // use selector context to bubble events and therefore enable re-use upon new blocks 
                      // http://interactjs.io/docs/#selector-contexts
        context: this.blockArea.nativeElement
      })
      // interact(cubo.nativeElement)
      .draggable({ 
        max: Infinity,
        restrict: { // prevent dragging them off-screen
          restriction: '.scroll-content',
          elementRect: { 
            left: 0, 
            top: 0, 
            right: 1, 
            bottom: 1 
          }
        }
      })
      .on('dragstart', function (event) {
          event.interaction.x = parseInt(event.target.getAttribute('data-x'), 10) || 0;
          event.interaction.y = parseInt(event.target.getAttribute('data-y'), 10) || 0;
          
          // make block visible above others
          event.target.style.zIndex = blockZIndex++;

          let silable = event.target.innerText;
          silableAudios[silable].play();
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
      })
    ;
  }
 dropzoneInteractables = [];

  createDropZones(){

    this.zonasDroppables.toArray().forEach((droppable, index) => {

      this.dropzoneInteractables.push(
        interact(droppable.nativeElement).dropzone({

          // Require a 50% element overlap for a drop to be possible
          overlap: 0.4,

          ondragenter: event => {
            // var draggableElement = event.relatedTarget,
            //     dropzoneElement = event.target;

            // feedback the possibility of a drop
            event.target.classList.add('drop-target');
            // draggableElement.classList.add('can-drop');
            // draggableElement.textContent = 'Dragged in';

            event.relatedTarget.classList.add('currently-placed-block');

            this.activeDropZone = parseInt(event.target.id);
          },
          ondragleave: event => {
            
            this.removeFromWord(event.relatedTarget.innerText);

            // set for onDrop later
            this.activeDropZone = 2;
            event.target.classList.remove('drop-target');

            event.relatedTarget.classList.remove('currently-placed-block');

          },
          ondrop: event => {
            this.onDrop(event);    
          },
          ondropdeactivate: event => {
            // console.log(event); // runs for each dropzone
          }
        })
      );
    }, this)
    // console.log(this.dropzoneInteractables);
  }

  setActiveDropZone(number:number) {
    this.activeDropZone = number;
  }

  onDrop(event) {

    let silable = event.relatedTarget.innerText;
    // console.log('activeDropZone at start: ' + this.activeDropZone);

    // if no block already in space, add it
    if ( !this.fullAlready(this.activeDropZone) ) {
      this.addToWord(silable, this.activeDropZone);
      this.snapToTarget(event);
    } else {
      // allow for small movements of the block, just re-snap
      if (this.word[this.activeDropZone] === silable){
        this.snapToTarget(event);
      } else {
        // prevent 2 blocks in the same dropzone
        this.ditchBlock(event.relatedTarget);
      }
    }
  }

  fullAlready(position:number){
    console.log(position);
    // i think i have to prevent a drop if it's not gonna make a word...
    if(this.word[position] === '') {
      return false;
    } else {
      return true;
    }
  }
  
  ditchBlock(block){
      block.classList.add('long-transition');
      let height = 30 + Math.random() * 4;
      block.style.marginTop = height + 'vh';
      let width = (Math.random() - 1) * 4;
      block.style.marginLeft = width + 'vh';
      setTimeout(() =>{
        block.style.top = block.offsetTop + 'px';
        block.style.left = block.offsetLeft + 'px';
        block.setAttribute('data-x', block.offsetLeft);
        block.setAttribute('data-y', block.offsetTop);
        block.style.marginTop = '';
        block.style.marginLeft = '';        
        block.classList.remove('long-transition');
        block.classList.remove('currently-placed-block');
      },800);
  }

  notAWord(){

    // shake the dropzones
    this.zonasDroppables.forEach((zona:ElementRef) => {
      zona.nativeElement.classList.add('shake');
      setTimeout(function() {
        zona.nativeElement.classList.remove('shake');
        // and change color of dashed outline back to default        
        zona.nativeElement.classList.remove('drop-target');            
      }, 800);
    });

    // push blocks down
    this.blocksQueryList.forEach(block => {
      if (block.nativeElement.classList.contains('currently-placed-block')){
        this.ditchBlock(block.nativeElement);
      }
    });

    // re-habilitate make dropzones 
    // this.dropzoneInteractables.forEach(dropzone => {
    //   dropzone.set({
    //     drop: {
    //       enabled: true
    //     }
    //   });
    // });
  
    // empty word static var
    this.word = ['',''];

  }

  snapToTarget(event) {
    let top = event.target.offsetParent.offsetTop + event.target.offsetTop + 
      ((event.target.offsetHeight - event.relatedTarget.offsetHeight) / 2),
        left = event.target.offsetParent.offsetLeft + event.target.offsetLeft + 
      ((event.target.offsetWidth - event.relatedTarget.offsetWidth) / 2);

    event.relatedTarget.style.top = top + 'px';
    event.relatedTarget.style.left = left + 'px';

    // set data- attributes *after* dragend event
    setTimeout(() => {
      event.relatedTarget.setAttribute('data-y', top);
      event.relatedTarget.setAttribute('data-x', left);
    }, 10);
  }

  addToWord(silable:string, position:number) {
    this.word[position] = silable;
    this.wordStream.next(this.word);
    console.log('addToWord called ', this.word);    
  }

  removeFromWord(silable) {
    if(this.word.indexOf(silable) >= 0) {
      this.word[this.word.indexOf(silable)] = '';
      // this.wordStream.next(this.word); // never gonna give a full word to pass the filter
    }
    console.log('removeFromWord called ', this.word);    
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
      this.scatterBlocks(this.updatedCurrentBlocks || this.blocksQueryList);
      this.notYetRun = false;
      setTimeout(()=>{
        this.notYetRun = true;
      }, 1000); 
    }
  }

}