import 'rxjs/add/operator/switchMap';
import { Component, OnInit, Input } from '@angular/core';
import { CanvasService }  from '../services/canvas.service';
import { CanvasModel } from '../services/canvas.model';
import { SharedDataService } from '../services/shareddata.service';
import { CompressService } from '../services/compress.service';

@Component({
  selector: 'app-canvas-list',
  template: `
  <div class="ml-3">
    <h3>Canvas list</h3>
      <ul *ngIf="!noData">
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
      <h4 *ngIf="noData">No canvas data found. What are you waiting for? Go and make something! :)</h4>
    </div>
  `,
})
export class CanvasListComponent implements OnInit {

  public canvases: CanvasModel[] = [];
  public canvas: CanvasModel;
  public noData: boolean = false;

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
            result => alert("Canvas removed"),
            error => alert("Something went wrong!")
        );
  }

  public takeCanvasToDesign(canvas: CanvasModel, toDesign: boolean){
    let canvasData = JSON.parse(canvas.canvasData);
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

  private setCanvases(canvases: CanvasModel[]){
    if(canvases.length == 0){
      this.noData = true;
    }
    else
    {
     this.canvases = canvases;  
    }
  }

  ngOnInit() {
    this.canvasService.getCanvases()
      .subscribe((
        canvases: CanvasModel[]) => {
          this.setCanvases(canvases);
        }
      );
  }
}