import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Videos } from './videos';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformMock } from '../../../test-config/mocks-ionic';

import { AudioFileService } from '../../building.blocks/audio.file.service';

import { AlfabetoCastillano } from '../../castillano/alfabeto.castillano';
import { PalabrasCastillano } from '../../castillano/palabras.castillano';
import { SilabasCastillano } from '../../castillano/silabas.castillano';
import { LecturasContent } from '../lectura/lecturas.content';


describe('Videos', () => {
  let de: DebugElement;
  let comp: Videos;
  let fixture: ComponentFixture<Videos>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Videos],
      imports: [
        IonicModule.forRoot(Videos)
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        AudioFileService,
        AlfabetoCastillano,
        PalabrasCastillano,
        SilabasCastillano,
        LecturasContent
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Videos);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('h3'));
  });

  it('should create component', () => expect(comp).toBeDefined());

  it('should have expected <h3> text', () => {
    fixture.detectChanges();
    const h3 = de.nativeElement;
    expect(h3.innerText).toMatch(/ionic/i,
      '<h3> should say something about "Ionic"');
  });

  /**
   * with internet, find that channel repo again
   * - file to play the name of the game exists
   * - tests with internet access?
   */

});
