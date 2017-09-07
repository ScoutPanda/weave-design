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

  public canvases: CanvasModel[] = [];
  public canvas: CanvasModel;

  constructor(
    private canvasService: CanvasService,
    private shareddata: SharedDataService,
    private compressService: CompressService
  ) {
    //this.canvases[0] = this.shareddata.canvas;
  }

  public remove(canvas: CanvasModel)
  {
    this.canvasService.removeCanvas(canvas)
        .subscribe(
            result => console.log(result)
        );
  }

  public koira(){
    console.log(this.shareddata.canvas)
  }

  public takeCanvasToDesign(canvas: CanvasModel, toDesign: boolean){
    let canvasData = JSON.parse(canvas.canvasData);
    console.log("koiradata" + canvasData)
    console.log(canvas)
    console.log(canvas.canvasName, canvas.authUserId, canvas.canvasId)
    console.log(canvasData.compressedHorCanvas)
    let horMax = this.compressService.getMaxFromCompressedHorArray(canvasData.compressedHorCanvas);
    let verMax = this.compressService.getMaxFromCompressedVerArray(canvasData.compressedVerCanvas);
    let width = canvasData.compressedHorCanvas.length;
    let height = canvasData.compressedVerCanvas.length;
    let horCanvasArray = this.compressService.prepare2DArray(horMax, width);
    let verCanvasArray = this.compressService.prepare2DArray(height, verMax)
    horCanvasArray = this.compressService.decompressHorCanvasArray(canvasData.compressedHorCanvas, horCanvasArray);
    verCanvasArray = this.compressService.decompressVerCanvasArray(canvasData.compressedVerCanvas, verCanvasArray);
    let mainCanvasArray = this.compressService.prepare2DArray(height, width);
    mainCanvasArray = this.compressService.constructMainCanvasArray(canvasData.compressedVerCanvas, canvasData.compressedHorCanvas, canvasData.resultCanvas, mainCanvasArray);
    let colorCanvasData = this.compressService.decompressColorData(canvasData.mappedVerColors, canvasData.mappedHorColors, canvasData.colorDataMap);
    
    let shaft = 0;
    horMax >= verMax ? shaft = horMax : shaft = verMax;

    if(!toDesign){
      horMax = shaft;
      verMax = shaft;
    }

    this.shareddata.hasInitialData = true;
    this.shareddata.shaft = shaft;
    this.shareddata.horMax = horMax;
    this.shareddata.verMax = verMax;
    this.shareddata.height = height;
    this.shareddata.width = width;
    this.shareddata.verCanvasArray = verCanvasArray;
    this.shareddata.horCanvasArray = horCanvasArray;
    this.shareddata.resultCanvasArray = canvasData.resultCanvas;
    this.shareddata.verColorArray = colorCanvasData.verColorArray;
    this.shareddata.horColorArray = colorCanvasData.horColorArray;
    this.shareddata.mainCanvasArray = mainCanvasArray;
    this.shareddata.horCPArray = null;
    this.shareddata.verCPArray = null;

    this.shareddata.canvasName = canvas.canvasName;
    this.shareddata.canvasId = canvas.canvasId;
  }

  ngOnInit() {
    this.canvasService.getCanvases()
      .subscribe((
        canvases: CanvasModel[]) => {
          this.canvases = canvases;
        }
      );
  }
}