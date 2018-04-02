import { Component, ViewChild, ViewChildren, AfterViewInit, QueryList, ElementRef, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/filter';

import {interact} from 'interact.js';

import { SilabasCastillano } from '../../castillano/silabas.castillano';
import { AudioFileService } from '../../building.blocks/audio.file.service';
import { Maguito } from '../../building.blocks/maguito.component';

import { Howl } from 'howler';
var silabasSprite = require('../../assets/audios/silabas/silabasSprite.json');

@Component({
  selector: 'bloques',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <button class="nav-button home" (click)="afs.volver()"><ion-icon name="home"></ion-icon></button>
  <button class="nav-button volume" (click)="afs.playPauseBackgroundMusic()">
    <span *ngIf="!afs.backgroundMusicHowl.playing()"  id="music-off">\\\</span>
    <ion-icon name="musical-notes"></ion-icon>
  </button>
  <button class="nav-button bulb" (click)="hint()"><ion-icon name="bulb"></ion-icon></button>
  <button class="nav-button refresh" (click)="newSilables()"><ion-icon name="refresh"></ion-icon></button>
  <div *ngIf="afs.isWeb && !allLoadedBool" id="loading">
    <img id="loader-circle" src="assets/maguito/loader.gif">
    <maguito></maguito>
  </div>

  <ion-content>

    <img #bgImg class="bg-img" src="assets/fondos/FONDO1.jpg">
    
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
    <img *ngFor="let color of blockColors" src="assets/cubos/cubo{{color}}.png">
    <img [src]="afs.transliterate(preloadedWordImagePath)">
  </div>
  `
})

export class Bloques implements AfterViewInit {

  word = ['','']
  wordHint:string[];
  createSilablesCalled:boolean = false;
  silables = [];

  wordImage:string;
  preloadedWordImagePath:string;
  
  blockColors = ['AMARILLO','AZUL','ROJO','VERDE'];
  activeDropZone:number;
  alertDismissed: boolean = false;
  notYetRun: boolean;

  bgLoaded:Observable<any>;
  silabasLoaded:Observable<any>;
  allLoaded:Observable<any>;
  allLoadedBool:boolean = false;
  
  @ViewChildren('blocks') blocksQueryList:QueryList<ElementRef>;
  @ViewChildren('droppable1, droppable2') zonasDroppables:QueryList<ElementRef>;
  @ViewChild('blockArea') blockArea:ElementRef;
  @ViewChild('bgImg') bgImg:ElementRef;

  wordStream:Subject<Array<string>> = new Subject();

  silabasHowl:Howl;

  constructor(
    private alertCtrl: AlertController,
    public castillano: SilabasCastillano, 
    public platform: Platform, 
    public afs: AudioFileService, 
    private change: ChangeDetectorRef
  ) {
    this.createSilables();
    this.preloadWordImage(this.wordHint.join(''));

    // AUDIO SETUP
      this.silabasHowl = new Howl({
      src: [
        "assets/audios/silabas/silabasSprite.webm",
        "assets/audios/silabas/silabasSprite.mp3"
      ],
      sprite: silabasSprite.sprite
    });

    // SETUP CHECKING IF SILABLE COMBINATION IS A WORD
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
        let safeSuccessWord = this.afs.transliterate(successWord);
        this.wordImage = successWord;
        
        setTimeout(() => {
          this.afs.playRandomBienAudio();
        },500);

        let alert = this.alertCtrl.create({
          title: successWord,
          message: '<img class="success-word" src="assets/imagenes/' + safeSuccessWord + '.png">',
          cssClass: 'bloques-alert',
          buttons: [
            {
              text: 'Siguente',
              role: 'cancel',
              cssClass: 'primary',
              handler: () => {
                this.newSilables();
                this.alertDismissed = true;
              }
            }
          ]
        });
        setTimeout(() => {
          alert.present();
        }, 2000);
        setTimeout(() => {
          console.log(this.afs.silableWords, successWord)
          this.afs.palabrasHowl.play( this.afs.transliterate(successWord) );
        }, 3000);
        setTimeout(() => {
          if(!this.alertDismissed) {
            alert.dismiss();
            this.newSilables();
          }
          // and reset
          this.alertDismissed = false;          
        }, 6000);
      })
    ;
 
  }
 
  ngAfterViewInit () {
    this.blocksQueryList.changes
      .subscribe(blocks => {
        // if the model has changed,
        if ( this.createSilablesCalled ) {
          this.scatterBlocks(blocks);
          this.createSilablesCalled = false;
        }
      }
    );
    this.makeBlocksDraggable();
    this.createDropZones();
    this.scatterBlocks(this.blocksQueryList);
    // this.newSilables();

    //
    // LOADING LOGIC
    //
    if(this.afs.isWeb) {
      this.bgLoaded = Observable.fromEvent(this.bgImg.nativeElement, 'load');
      
      if ( this.silabasHowl.state() === 'loading' ) {
        this.silabasLoaded = Observable.fromEvent(this.silabasHowl, 'load');
        this.allLoaded = Observable.zip(this.bgLoaded, this.silabasLoaded);
        this.allLoaded.subscribe(status => {
          this.clearLoadingPlayInstruction();
        });
      } else {
        this.bgLoaded.subscribe(() => {
          this.clearLoadingPlayInstruction();          
        });
      }

    } else {
      this.clearLoadingPlayInstruction();
    }

  }

  clearLoadingPlayInstruction() {
    this.allLoadedBool = true;
    // tell angular to trigger change detection.
    // necessary when howler uses Web Audio API or angular will wait for subsequent click
    this.change.detectChanges(); 
    setTimeout(() => {
      this.silabasHowl.play('instruccion');
    }, 2000);
  }

  reset() {
    
    this.word = ['',''];

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
    this.createSilablesCalled = true;
  }

  newSilables() {
    this.reset(); 
    this.createSilables();
    // this.scatterBlocks(this.blocksQueryList);    
    this.preloadWordImage(this.wordHint.join(''));
    this.change.detectChanges();
  }
  
  preloadWordImage(word:string) {
    this.preloadedWordImagePath = "assets/imagenes/" + word + ".png";
  }

  hint(){
    let blocks:QueryList<ElementRef> = this.blocksQueryList;
    blocks.forEach(block => {
      if(this.wordHint.indexOf(block.nativeElement.firstElementChild.innerHTML) >= 0) {
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
        blockWidth = this.blockArea.nativeElement.offsetWidth / 4, // 25% width set in scss
        blockZIndex = 1;
    
    blocks.forEach( cubo => {

      let top = Math.round( Math.random() * (blockAreaHeight - blockWidth) ) + blockAreaOffset,
          left = Math.round( Math.random() * (this.blockArea.nativeElement.offsetWidth - blockWidth) );
    
      cubo.nativeElement.style.left = left + 'px';
      cubo.nativeElement.style.top = top + 'px';
      cubo.nativeElement.setAttribute('data-x', left);
      cubo.nativeElement.setAttribute('data-y', top);

      // set random block color
      cubo.nativeElement.style.backgroundImage
       = 'url("assets/cubos/cubo' + this.shuffle(this.blockColors)[0] + '.png")';

      cubo.nativeElement.classList.remove('currently-placed-block');

      cubo.nativeElement.style.zIndex = blockZIndex;
      cubo.nativeElement.firstElementChild.style.zIndex = blockZIndex; // iphones
      blockZIndex++;

    });
  }

  makeBlocksDraggable() {
    
    interact.maxInteractions(Infinity);

    let blockZIndex = 6;
    
    // use selector context to bubble events
    // and therefore enable re-use upon new blocks 
    // http://interactjs.io/docs/#selector-contexts
    interact('.cubo', { 
        context: this.blockArea.nativeElement
      })
      // interact(cubo.nativeElement)
      .draggable({ 
        max: Infinity,
        inertia: true,
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
      .on('dragstart', (event) => {
          event.interaction.x = parseInt(event.target.getAttribute('data-x'), 10) || 0;
          event.interaction.y = parseInt(event.target.getAttribute('data-y'), 10) || 0;
          
          // make block visible above others
          event.target.style.zIndex = blockZIndex;
          event.target.firstElementChild.style.zIndex = blockZIndex; // iphones
          blockZIndex++;
          let silable = event.target.firstElementChild.innerHTML;
          this.silabasHowl.play(this.afs.transliterate(silable));
      })
      .on('dragmove', (event) => {
          event.interaction.x += event.dx;
          event.interaction.y += event.dy;
          event.target.style.left = event.interaction.x + 'px';
          event.target.style.top  = event.interaction.y + 'px';
      })
      .on('dragend', (event) => {
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
            
            this.removeFromWord(event.relatedTarget.firstElementChild.innerHTML);

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

    let silable = event.relatedTarget.firstElementChild.innerHTML;
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
    // smooth css transition
    block.classList.add('long-transition');

    // push away from drop areas by adding to absolute positions
    // randomize to avoid all rejects being stacked exactly on top of each other
    let newTop = parseInt(block.style.top) + 200 + Math.random() * 50;
    let newLeft = parseInt(block.style.left) + (Math.random() - 0.5) * 50;
    block.style.top = newTop + 'px';
    block.style.left = newLeft + 'px';
    
    // once the css transition duration has ended,
    setTimeout(() =>{    
      // set the interactable data attributes in order for subsequent drags not to jump
      block.setAttribute('data-x', block.offsetLeft);
      block.setAttribute('data-y', block.offsetTop);

      // and remove classes that would now interfere
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
        setTimeout(() => {
          this.ditchBlock(block.nativeElement);
        }, 10);
      }
    });

    // crush their spirits
    this.afs.playRandomIncorrectoAudio();

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

  @HostListener('window:resize', ['$event'])
  onResize(){
    console.log(this.notYetRun);
    // debounced resize
    if ( this.notYetRun === true || typeof(this.notYetRun) === 'undefined') {
      this.scatterBlocks(this.blocksQueryList);
      this.notYetRun = false;
      setTimeout(()=>{
        this.notYetRun = true;
      }, 1000); 
    }
  }

}