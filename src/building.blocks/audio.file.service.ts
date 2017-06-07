import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { AlfabetoCastillano } from '../castillano/alfabeto.castillano';
import { PalabrasCastillano } from '../castillano/palabras.castillano';
import { SilabasCastillano } from '../castillano/silabas.castillano';
import { LecturasContent } from '../pages/lectura/lecturas.content';

@Injectable()
export class AudioFileService {

    homePageButtons = {}
    letters = {};
    silables = {};
    words = {};
    silableWords = {};
    lecturas = {}
    muybien = {};
    incorrecto = {};
    instructions = {};
    risa = {};
    beep:HTMLAudioElement = new Audio("assets/muybien/beep.mp3");
    bell:HTMLAudioElement = new Audio("assets/muybien/bell.mp3");
    beeped:boolean = false;
    belled:boolean = false;
    backgroundMusic:HTMLAudioElement = new Audio('assets/HappyBee.mp3');
    backgroundMusicPlaying:boolean = false;

    isWeb:boolean;
    
    constructor(public platform: Platform,
                public lettersCastillano: AlfabetoCastillano,
                public silablesCastillano: SilabasCastillano,
                public wordsCastillano: PalabrasCastillano,
                public lecturasCastillano: LecturasContent
                ) {
        console.log('ionic platforms: ', this.platform.platforms());

        if (platform.is('mobileweb') || platform.is('core')) {
            this.isWeb = true;
        } else {
            this.isWeb = false;
        }

    }

    populateAudios(audioListName:string) {
        switch (audioListName) {

            case 'letters':
                if ( Object.keys(this.letters).length < 1 ) { // hasn't yet been populated
                    console.log('populate letters');
                    this.lettersCastillano.alfabeto.forEach( letter  => {
                        this.letters[letter.letra] = new Audio('assets/letra_sonidos/' + letter.letra + '.MP3');
                    });
                    this.playPause(this.letters);
                }
            break;

            case 'silables':
                if ( Object.keys(this.silables).length < 1 ) { // hasn't yet been populated
                    console.log('populate silables');
                    this.silablesCastillano.silables.forEach( silable  => {
                        this.silables[silable] = new Audio('assets/silabas/' + silable + '.MP3');
                    });
                    this.playPause(this.silables);
                }
            break;  

            case 'words':
                if ( Object.keys(this.words).length < 1 ) { // hasn't yet been populated
                    console.log('populate words');
                    this.wordsCastillano.words.forEach( word  => {
                        this.words[word] = new Audio('assets/palabras/' + word + '.MP3');
                    });
                    this.playPause(this.words);
                }
            break;

            case 'silableWords':
                if ( Object.keys(this.silableWords).length < 1 ) { // hasn't yet been populated
                    console.log('populate silableWords');
                    this.silablesCastillano.words.forEach( word  => {
                        let wordString = word.join('');
                        this.silableWords[wordString] = new Audio('assets/palabras/' + wordString + '.MP3');
                    });
                    this.playPause(this.silableWords);
                }
            break;

            case 'lecturas':
                if ( Object.keys(this.lecturas).length < 1 ) { // hasn't yet been populated
                    console.log('populate lecturas');
                    this.lecturasCastillano.lecturas.forEach( lectura  => {
                        this.lecturas[lectura.fileName] = new Audio('assets/lecturas_audio/' + lectura.fileName + '.MP3');
                    });
                    this.playPause(this.lecturas);
                }
            break;

            case 'muybien':
                if ( Object.keys(this.muybien).length < 1 ) { // hasn't yet been populated
                    console.log('populate muybien');
                    ['0','1','2','3','4','5','6'].forEach(number => {
                        this.muybien[number] = new Audio("assets/muybien/" + number + '.MP3');
                    });
                    this.playPause(this.muybien);
                }
            break;

            case 'incorrecto':
                if ( Object.keys(this.incorrecto).length < 1 ) { // hasn't yet been populated
                    console.log('populate incorrecto');
                    ['0','1'].forEach(number => {
                        this.incorrecto[number] = new Audio("assets/incorrecto/" + number + '.MP3');
                    });
                    this.playPause(this.incorrecto);
                }
            break;

            case 'risa':
                if ( Object.keys(this.risa).length < 1 ) { // hasn't yet been populated
                    console.log('populate risa');
                    ['0','1','2','3','4'].forEach(number => {
                        this.risa[number] = new Audio("assets/risa/" + number + '.MP3');
                    });
                    this.playPause(this.risa);
                }
            break;

            case 'beep':
                if ( this.platform.is('mobileweb') && !this.beeped) { // hasn't yet been populated
                    console.log('populate beep');
                    this.playPauseSingle(this.beep);
                    this.beeped = true;
                }
            break;

            case 'bell':
                if ( this.platform.is('mobileweb') && !this.belled ) { // hasn't yet been populated
                    console.log('populate bell');
                    this.playPauseSingle(this.bell);
                    this.belled = true;
                }
            break;
        }
    }

    populateInstruction(audioFileName:string) {
        if (typeof(this.instructions[audioFileName]) === 'undefined') {
            this.instructions[audioFileName] = new Audio("assets/instrucciones/" + audioFileName + '.MP3');
            if ( this.platform.is('mobileweb') ) { 
                this.playPauseSingle(this.instructions[audioFileName]);
            }
        }
        console.log('populateInstruction called. After: ', this.instructions);
    }

    playPause ( audioObject:{} ) {
        console.log('playpause called.');

        if ( this.platform.is('mobileweb') ) { // browser on phone  
            if (typeof(audioObject['playpaused']) === 'undefined') {
                console.log('playPause run: ', audioObject);
                for (var key in audioObject) {
                    if (audioObject.hasOwnProperty(key)) {
                        this.playPauseSingle(audioObject[key]);
                    }
                }
            }
            audioObject['playpaused'] = true;
        }
    }

    playPauseSingle(audio:HTMLAudioElement) {
        if (audio.played.length === 0) {
            audio.volume = 0;
            audio.play();
            // console.log('readyState: ', audio, audio.readyState);

            let pauseAndVolumeUp = () => {
                // console.log('playpaused: ', audio);
                audio.pause();
                audio.volume = 1;
                audio.removeEventListener('canplay', pauseAndVolumeUp); 
            }

            audio.addEventListener('canplay', pauseAndVolumeUp);
        }
    }

    playWhenReady(audio:HTMLAudioElement) {
        audio.currentTime = 0; // equalize different firefox/chrome behaviour

        console.log(audio, audio.readyState);
        if (audio.readyState > 3) {
          audio.play();
        } else {
          audio.addEventListener('canplaythrough', () => {
            audio.play();
            // removeEventListener? or not since readyState will be at 4 from now on?
          })
        }
    }

    playRandomBienAudio(){
        let random = Math.round(Math.random() * 6.499);
        this.playWhenReady(this.muybien[random.toString()]);
    }

    playRandomIncorrectoAudio(){
        let random = Math.round(Math.random());
        this.playWhenReady(this.incorrecto[random.toString()]);
    }

    playRandomRisaAudio(){
        let random = Math.round(Math.random() * 4.2);
        this.risa[random.toString()].play();
    }

    playPauseBackgroundMusic(){
        if (!this.backgroundMusicPlaying) {
            // not use playWhenReady because want resume where left off...
            this.backgroundMusic.play();
            this.backgroundMusicPlaying = true;
        } else {
            this.backgroundMusic.pause();
            this.backgroundMusicPlaying = false;
        }
    }
}