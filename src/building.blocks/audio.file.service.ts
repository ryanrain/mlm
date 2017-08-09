import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Howl } from 'howler';

var appSprite = require('../assets/audios/app/appSprite.json');
var palabrasSprite = require('../assets/audios/palabras/palabrasSprite.json');

@Injectable()
export class AudioFileService {

    words = {};
    silableWords = {};
    lecturas = {};
    incorrecto = {};
    instructions = {};

    appHowl:Howl;
    palabrasHowl:Howl;
    backgroundMusicHowl:Howl;

    isWeb:boolean;

    constructor( public platform: Platform ) {
        console.log('ionic platforms: ', this.platform.platforms());

        if (platform.is('mobileweb') || platform.is('core')) {
            this.isWeb = true;
        } else {
            this.isWeb = false;
        }

        if (platform.is('cordova')) {
            this.appHowl = new Howl({
                src: [
                    "assets/audios/app/appSprite.webm",
                    "assets/audios/app/appSprite.mp3"
                ],
                sprite: appSprite.sprite,
                html5: true
            });

            this.palabrasHowl = new Howl({
                src: [
                    "assets/audios/palabras/palabrasSprite.webm",
                    "assets/audios/palabras/palabrasSprite.mp3"
                ],
                sprite: palabrasSprite.sprite,
                html5: true
            });

            this.backgroundMusicHowl = new Howl({
                src: ['assets/audios/backgroundMusic/HappyBee_32.webm', 'assets/audios/backgroundMusic/HappyBee_32.mp3'],
                loop: true,
                volume: 0.2,
                html5: true
            });
        } else {
            this.appHowl = new Howl({
                src: [
                    "assets/audios/app/appSprite.webm",
                    "assets/audios/app/appSprite.mp3"
                ],
                sprite: appSprite.sprite
            });

            this.palabrasHowl = new Howl({
                src: [
                    "assets/audios/palabras/palabrasSprite.webm",
                    "assets/audios/palabras/palabrasSprite.mp3"
                ],
                sprite: palabrasSprite.sprite
            });

            this.backgroundMusicHowl = new Howl({
                src: ['assets/audios/backgroundMusic/HappyBee_32.webm', 'assets/audios/backgroundMusic/HappyBee_32.mp3'],
                loop: true,
                volume: 0.2
            });
        }

    }

    transliterate(fileName:string) {
        return fileName.replace('ñ', 'ni')
            .replace('á','a')
            .replace('é','e')
            .replace('í','i')
            .replace('ó','o')
            .replace('ú','u');
    }

    playRandomBienAudio(){
        let randomBien = Math.round(Math.random() * 6.499).toString();
        this.appHowl.play(randomBien);
    }

    playRandomIncorrectoAudio(){
        let randomIncorrect = 'incorrecto' + Math.round(Math.random()).toString(); // only two choices: 0 and 1
        console.log(randomIncorrect);
        
        this.appHowl.play(randomIncorrect);
    }

    playPauseBackgroundMusic(){
        if (!this.backgroundMusicHowl.playing()) {
            // not use playWhenReady because want resume where left off...
            this.backgroundMusicHowl.play();
        } else {
            this.backgroundMusicHowl.pause();
        }
    }

}