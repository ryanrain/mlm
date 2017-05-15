import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { AlfabetoCastillano } from '../castillano/alfabeto.castillano';
import { PalabrasCastillano } from '../castillano/palabras.castillano';
import { SilabasCastillano } from '../castillano/silabas.castillano';

@Injectable()
export class AudioFileService {

    letters = {};
    silables = {};
    words = {};
    silableWords = {};
    muybien = {};
    instructions = {};
    
    constructor(public platform: Platform,
                public lettersCastillano: AlfabetoCastillano,
                public silablesCastillano: SilabasCastillano,
                public wordsCastillano: PalabrasCastillano
                ) {
        console.log('ionic platforms: ', this.platform.platforms());
    }

    populateAudios(audioListName:string) {
        switch (audioListName) {

            case 'letters':
                if ( Object.keys(this.letters).length < 1 ) { // hasn't yet been populated
                    console.log('populate letters');
                    this.lettersCastillano.alfabeto.forEach( letter  => {
                        this.letters[letter.letra] = new Audio('/assets/letra_sonidos/' + letter.letra + '.MP3');
                    });
                    // note: haven't confirmed that ios devices don't also throw "API can only be initiated by a user gesture." error. Just can't see anything in BrowserStack console
                    if ( this.platform.is('android') && this.platform.is('mobileweb') ) { 
                        this.playPause(this.letters);
                    }
                }
            break;

            case 'silables':
                if ( Object.keys(this.silables).length < 1 ) { // hasn't yet been populated
                    console.log('populate silables');
                    this.silablesCastillano.silables.forEach( silable  => {
                        this.silables[silable] = new Audio('/assets/silabas/' + silable + '.MP3');
                    });
                    // note: haven't confirmed that ios devices don't also throw "API can only be initiated by a user gesture." error. Just can't see anything in BrowserStack console
                    if ( this.platform.is('android') && this.platform.is('mobileweb') ) { 
                        this.playPause(this.silables);
                    }
                }
            break;  

            case 'words':
                if ( Object.keys(this.words).length < 1 ) { // hasn't yet been populated
                    console.log('populate words');
                    this.wordsCastillano.words.forEach( word  => {
                        this.words[word] = new Audio('/assets/palabras/' + word + '.MP3');
                    });
                    // note: haven't confirmed that ios devices don't also throw "API can only be initiated by a user gesture." error. Just can't see anything in BrowserStack console
                    if ( this.platform.is('android') && this.platform.is('mobileweb') ) { 
                        this.playPause(this.words);
                    }
                }
            break;

            case 'silableWords':
                if ( Object.keys(this.silableWords).length < 1 ) { // hasn't yet been populated
                    console.log('populate silableWords');
                    this.silablesCastillano.words.forEach( word  => {
                        let wordString = word.join('');
                        this.silableWords[wordString] = new Audio('/assets/palabras/' + wordString + '.MP3');
                    });
                    // note: haven't confirmed that ios devices don't also throw "API can only be initiated by a user gesture." error. Just can't see anything in BrowserStack console
                    if ( this.platform.is('android') && this.platform.is('mobileweb') ) { 
                        this.playPause(this.silableWords);
                    }
                }
            break;

            case 'muybien':
                if ( Object.keys(this.muybien).length < 1 ) { // hasn't yet been populated
                    console.log('populate muybien');
                    ['0','1','2','3','4','5','6'].forEach(number => {
                        this.muybien[number] = new Audio("assets/muybien/" + number + '.MP3');
                    });

                    // note: haven't confirmed that ios devices don't also throw "API can only be initiated by a user gesture." error. Just can't see anything in BrowserStack console
                    if ( this.platform.is('android') && this.platform.is('mobileweb') ) { 
                        this.playPause(this.muybien);
                    }
                }
            break;
        }
    }

    populateInstructions(audioFileName:string) {

        this.instructions[audioFileName] = new Audio("assets/instrucciones/" + audioFileName + '.MP3');

        if ( this.platform.is('android') && this.platform.is('mobileweb') ) { 
            this.playPause(this.instructions);
        }
    }

    playPause ( audioObject:{} ) {
        console.log('playpause called. ',audioObject);
        for (var key in audioObject) {
            if (audioObject.hasOwnProperty(key)) {
                // console.log(audioObject[key]);
                this.playPauseSingle(audioObject[key]);
            }
        }
    }

    playPauseSingle(audio:HTMLAudioElement) {
        audio.volume = 0;
        audio.play();
        audio.addEventListener('canplay', () => {
            // console.log('playpaused: ', audio);
            audio.pause();
            audio.volume = 1;
            audio.removeEventListener('canplay');
        });       
    }

    playWhenReady(audio:HTMLAudioElement) {
        console.log(audio, audio.readyState);
        if (audio.readyState > 3) {
          audio.play();
        } else {
            // if ( audio.readyState === 0 ) {

            // }
          audio.addEventListener('canplaythrough', () => {
            audio.play();
          })
        }
    }

}