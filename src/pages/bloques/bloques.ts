import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SilabasCastillano } from '../../silabas/silabas.castillano';

@Component({
  selector: 'bloques',
  // templateUrl: 'bloques.html',
  template: `
  <button class="volver" (click)="volver()"><ion-icon name="home"></ion-icon></button>

    <ion-content padding [ngClass]="{
                woohoo:(woohoo) 
              }">
      <p>&nbsp;</p>

      <ion-row>

        <div class="col lugar"
            dnd-sortable-container 
            [sortableData]="lugar1"
            >

            <div class="droppable">
              <div *ngFor="let silaba of lugar1; let x = index" class="cubo"
                dnd-sortable [sortableIndex]="x" [dragEnabled]="true"
                [dragData]="silaba">
                  {{silaba}}
              </div>
            </div>
        </div>

        <div class="col lugar"
            dnd-sortable-container 
            [sortableData]="lugar2">

            <div class="droppable">
              <div *ngFor="let silaba of lugar2; let x = index" class="cubo"
                dnd-sortable [sortableIndex]="x" [dragEnabled]="true"
                [dragData]="silaba">
                  {{silaba}}
              </div>
            </div>
        </div>

      </ion-row>

      <p>&nbsp;</p>

      <div
        dnd-sortable-container 
        [sortableData]="nuevosCubos">

        <div 
          *ngFor="let silaba of nuevosCubos; let x = index" 
          class="cubo"
          dnd-sortable [sortableIndex]="x" [dragEnabled]="true"
          [dragData]="silaba">{{silaba}}
        </div>

      </div>

    </ion-content>`
})

export class Bloques {
/*
somehow limit that the lugar only have one single block


one immutable list of blocks, 

and when dropped over lugar then copied into it... 
(onDropSuccess)="addToLugar1($event)"
 - snap into place, 
 - set css (z-index?) so that dropbox not accessible, or covered?
 - specify that that block is in a lugar. if dragged anywhere else then 


everywhere else (onDropSuccess) pop that block out of any lugar


or another approach: 
no modules, just absolute positioning cubos with mouseevent observable
if drop event within vh calculation: top left corner of cubo between percentages from top and left (or 700px)
  then set "left full" variable true: now no other blocks can be placed in left spot
  // somehow be able to remove blocks from spots - keep track of the mousedown event
if (adentroLugar(lugar:{}, currentLocation:{})) {
  add new silaba string to lugar observable
}
.zip(lugar1, lugar2){
  [lugar1, lugar2].toString()
}
.subscribe(combinedFullWords) {
  if(palabrasCastillano:string[].indexOf(combinedFullWords){
    woohooitsaword(index);
    crearNuevosCubos();
  }
}


*/
  woohoo:boolean = false;
  silabasAlAzar:string[];
  lugar1 = [];
  lugar2 = [];
  nuevosCubos = [];

  constructor(
    public navCtrl: NavController,
    public castillano: SilabasCastillano
  ) {
    this.crearNuevosCubos();
  }
 
  crearNuevosCubos(){
    this.woohoo = false;
    this.silabasAlAzar = this.shuffle(this.castillano.listaSilabas);
    //take(8)
    this.nuevosCubos = this.silabasAlAzar.slice(0,5);
    console.info(this.nuevosCubos);
  }

  allowDrop(lugar:string) {
    if(lugar == 'lugar1' && this.lugar1.length == 0) {
      return true;
    }
    if(lugar == 'lugar2' && this.lugar2.length == 0) {
      return true;
    }
    return false;
  }

  addToLugar1($event){
    console.log($event);
  }
  addToLugar2($event){
    console.log($event);
  }
  // todo: how to 
  // public get lugar1getter() {
  //   return this.lugar1.filter((item, index) => index > 2 )
  // }

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

  esPalabra(eleccion1:string, eleccion2:string):boolean {
    // console.log(eleccion);
    return false;
  }
  
  volver() {
    this.navCtrl.pop();
  }

}


class Container {
  constructor(public id: number, public name: string, public widgets: Array<Widget>) {}
}

class Widget {
  constructor(public name: string) {}
}