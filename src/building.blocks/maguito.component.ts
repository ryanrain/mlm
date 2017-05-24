import { Component, ViewChild, ElementRef } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/throttleTime';

import { AudioFileService } from './audio.file.service';

@Component({
    selector: 'maguito',
      template: `
        <img #maguito id="maguito" src="assets/maguito/maguito-parpadea.gif">
        <div style="display:none;" class="preloader">
            <img rel="preload" src="assets/maguito/maguito-rie.gif">
            <img rel="preload" src="assets/maguito/maguito-wooo.gif">
        </div>
        `
})
export class Maguito {

    @ViewChild('maguito') maguito:ElementRef;
    maguitoClicks:Observable<any>;
    duration:number = 1500;

    constructor(public afs: AudioFileService) {

    }

    ngAfterViewInit() {
        this.maguitoClicks = Observable.fromEvent(this.maguito.nativeElement, 'click');
        this.maguitoClicks
            .throttleTime(this.duration)
            .subscribe(event => {
            this.randomMaguitoTrick(event);
        });

    }
    randomMaguitoTrick(event:any) {

        let randomSrc = Math.random();
        if ( randomSrc > 0.5 ) {
            event.target.src = 'assets/maguito/maguito-wooo.gif';
        } else {
            event.target.src = 'assets/maguito/maguito-rie.gif';
        }

        let random = Math.round(Math.random() * 5.2);
        let animationClassName = 'maguito-' + random;
        event.target.classList.add(animationClassName);

        if ( Object.keys(this.afs.risa).length < 1 ) { // afs.risa not populated yet
            this.afs.populateAudios('risa');
            this.afs.playWhenReady(this.afs.risa[0]);
        } else {
            this.afs.playRandomRisaAudio();
        }

        setTimeout(() => {
            event.target.src = 'assets/maguito/maguito-parpadea.gif'            
            event.target.classList.remove(animationClassName);         
        },this.duration);
    }
    
}