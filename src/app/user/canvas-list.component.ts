import 'rxjs/add/operator/switchMap';
import { Component, OnInit, Input } from '@angular/core';
import { CanvasService }  from '../services/canvas.service';
import { CanvasModel } from '../services/canvas.model';
import { SharedDataService } from '../services/shareddata.service';
import { CompressService } from '../services/compress.service';

@Component({
  selector: 'app-canvas-list',
  template: `
  <h2>CANVASES</h2>
    <ul>
        <li *ngFor="let canvas of canvases">
            <span>{{canvas.canvasName}}</span><button (click)=remove(canvas)>remove</button>
            <a (click)="takeCanvasToDesign(canvas, true)" [routerLink]=" ['/design']" routerLinkActive="active">
              Weave design
            </a>
            <a (click)="takeCanvasToDesign(canvas, false)" [routerLink]=" ['/maker']" routerLinkActive="active">
              Pattern maker
            </a>
        </li>
    </ul>
  `,
})
export class CanvasListComponent implements OnInit {

  public canvases: CanvasModel[];
  public canvas: CanvasModel;

  constructor(
    private canvasService: CanvasService,
    private shareddata: SharedDataService,
    private compressService: CompressService
  ) {}

  public remove(canvas: CanvasModel)
  {
    this.canvasService.removeCanvas(canvas)
        .subscribe(
            result => console.log(result)
        );
  }

  public takeCanvasToDesign(canvas: CanvasModel, toDesign: boolean){
    let canvasData = JSON.parse(canvas.canvasData);
    let horCanvasArray = this.compressService.decompressHorCanvasArray(canvasData.compressedHorCanvas, Array());
    let verCanvasArray = this.compressService.decompressVerCanvasArray(canvasData.compressedVerCanvas, Array());
    let colorCanvasData = this.compressService.decompressColorData(canvasData.mappedHorColors, canvasData.mappedVerColors, canvasData.colorDataMap);
    let width = verCanvasArray.length;
    let height = horCanvasArray.length;
    let horMax = this.compressService.getMaxFromCompressedHorArray(canvasData.compressedHorCanvas);
    let verMax = this.compressService.getMaxFromCompressedVerArray(canvasData.compressedVerCanvas);
    
    let shaft = 0;
    
    if(!toDesign){
      horMax = shaft;
      verMax = shaft;
    }

    horMax >= verMax ? shaft = horMax : shaft = verMax;

    this.shareddata.hasInitialData = true;
    this.shareddata.shaft = shaft;
    this.shareddata.horMax = horMax;
    this.shareddata.verMax = verMax;
    this.shareddata.height = height;
    this.shareddata.width = width;
    this.shareddata.verCanvasArray = verCanvasArray;
    this.shareddata.horCanvasArray = horCanvasArray;
    this.shareddata.resultCanvasArray = canvasData.resultCanvasArray;
    this.shareddata.verColorArray = colorCanvasData.verColorArray;
    this.shareddata.horColorArray = colorCanvasData.horColorArray;
    this.shareddata.horCPArray = null;
    this.shareddata.verCPArray = null;

    this.shareddata.canvasName = canvas.canvasName;
    this.shareddata.canvasId = canvas.canvasId;
  }
    /*public shareData(toDesign: boolean){
      this.horMax >= this.verMax ? this.shaft = this.horMax : this.shaft = this.verMax;
      this.horMax = this.shaft;
      this.verMax = this.shaft;
    this.shareddata.hasInitialData = true;
    
    this.shareddata.shaft = this.shaft;
    this.shareddata.horMax = this.horMax;
    this.shareddata.verMax = this.verMax;
    this.shareddata.height = this.height;
    this.shareddata.width = this.width;
    this.shareddata.mainCanvasArray = this.mainCanvasArray;
    this.shareddata.verCanvasArray = this.verCanvasArray;
    this.shareddata.horCanvasArray = this.horCanvasArray;
    this.shareddata.resultCanvasArray = this.resultCanvasArray;
    this.shareddata.verColorArray = this.verColorArray;
    this.shareddata.horColorArray = this.horColorArray;
    this.shareddata.horCPArray = this.horCPArray;
    this.shareddata.verCPArray = this.verCPArray;
  }*/

  ngOnInit() {
    this.canvasService.getCanvases()
      .subscribe((
        canvases: CanvasModel[]) => {
          this.canvases = canvases;
        }
      );
  }
}