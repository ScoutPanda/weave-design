import { Component, OnInit, Input, Renderer2 } from '@angular/core';

import { AuthService } from '../../services/auth.service';

import { CanvasService } from '../../services/canvas.service';

import { CanvasModel } from '../../services/canvas.model';
import { CanvasDataModel } from '../../services/canvasdata.model';

import { CanvasDrawingService } from './canvas-drawing.service'

import { CanvasCtxInterface } from './canvas-ctx.interface';

import { SaveToPngService } from '../../services/savetopng.service';

import { SharedDataService } from '../../services/shareddata.service';

import { CompressService } from '../../services/compress.service';

import { isNumeric } from 'rxjs/util/isNumeric';

@Component({
  selector: 'canvas-drawing',
  templateUrl: './canvas-drawing.component.html',
  styleUrls: ['./canvas-drawing.component.css']
})

export class CanvasDrawingComponent implements OnInit {
  @Input() isDesign: boolean = true;

  private mainCanvasArray: any[] = [];
  private resultCanvasArray: any[] = [];
  private verCanvasArray: any[] = [];
  private horCanvasArray: any[] = [];
  private horColorArray: any[] = [];
  private verColorArray: any[] = [];
  private canvasArray;
  private horMax: number = 2;
  private verMax: number = 2;
  private padding: number = 5;

  public hideMenuClicked: boolean = false;

  public saveSuccess: boolean = true;

  private ctxObject = {} as CanvasCtxInterface;

  private hadInitialData: boolean = false;

  public width: number = 10;
  public height: number = 10;
  public shaft: number = 2;
  public rectSize: number = 14;

  public visibleWidth: number = 10;
  public visibleHeight: number = 10;
  public visibleShaft: number = 2;
  public visibleRectSize: number = 14;
  public visibleCanvasName: string = "";
  public isMenuFixed: boolean = false;

  public horCPArray: any[] = ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'];
  public verCPArray: any[] = ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'];

  public executeClicked: boolean = false;

  public verColor: string = "#fff500";
  public horColor: string = "#F8F8FF";
  public defaultVerColor: string = "#fff500";
  public defaultHorColor: string = "#F8F8FF";
  public defaultWhite: string = "#F8F8FF";
  public defaultGray: string = "#9E9E9E";
  public defaultRectStrokeColor: string = "#616161";
  public defaultLineWidth: number = 2;
  public isAdditionMode: boolean = true;

  public canvasName: string = "";
  private canvasId: string;

  constructor(
    private auth: AuthService,
    private canvasService: CanvasService,
    private canvasDrawingService: CanvasDrawingService,
    private saveToPngService: SaveToPngService,
    private renderer2: Renderer2,
    private shareddata: SharedDataService,
    private compressService: CompressService
  ) {
    if(this.shareddata.hasInitialData){
      this.shaft = this.shareddata.shaft;
      this.height = this.shareddata.height;
      this.width = this.shareddata.width;
      this.horMax = this.shareddata.horMax;
      this.verMax = this.shareddata.verMax;
      this.mainCanvasArray = this.shareddata.mainCanvasArray;
      this.verCanvasArray = this.shareddata.verCanvasArray;
      this.horCanvasArray = this.shareddata.horCanvasArray;
      this.resultCanvasArray = this.shareddata.resultCanvasArray;
      this.verColorArray = this.shareddata.verColorArray;
      this.horColorArray = this.shareddata.horColorArray;
      this.horCPArray = this.shareddata.horCPArray !== null ? this.shareddata.horCPArray : this.horCPArray;
      this.verCPArray = this.shareddata.verCPArray !== null ? this.shareddata.verCPArray : this.verCPArray;
      this.shareddata.hasInitialData = false;
      this.hadInitialData = true;
      localStorage.setItem("isDirty", "true");
    }
  }

  private initCanvases(){
    let canvasArray = document.getElementsByTagName('canvas');
    let len = canvasArray.length;
    let canvas: HTMLCanvasElement;
    for(let i = 0; i < len; i++){
      canvas = <HTMLCanvasElement>canvasArray[i];
      this.refreshCtx(canvas.getContext("2d"));
    }
    this.canvasArray = canvasArray;
  }

  private refreshCtx (ctx: CanvasRenderingContext2D): CanvasRenderingContext2D{
    ctx.lineWidth = this.defaultLineWidth;
    ctx.strokeStyle = this.defaultRectStrokeColor;
    this.ctxObject[ctx.canvas.id] = ctx;
    return ctx;
  }

  public draw(){
    if(!this.hadInitialData){
      this.initializeDrawArea();
    }
    if(!this.isDesign){
      this.updateHorMaxAndVerMax();
    }
    this.isReverse = false;
    this.drawCanvases();

    this.hadInitialData = false;
  }

  public initializeDrawArea(){
      this.horColor = this.defaultHorColor;
      this.verColor = this.defaultVerColor;
      this.verColorArray = this.canvasDrawingService.prepareColorArray(Array(), this.height, this.verColor);
      this.horColorArray = this.canvasDrawingService.prepareColorArray(Array(), this.width, this.horColor);
      this.mainCanvasArray = this.canvasDrawingService.prepare2DArray(Array(), this.height, this.width);
      this.resultCanvasArray = this.canvasDrawingService.prepare2DArray(Array(), this.shaft, this.shaft);
      this.horCanvasArray = this.canvasDrawingService.prepare2DArray(Array(), this.shaft, this.width);
      this.verCanvasArray = this.canvasDrawingService.prepare2DArray(Array(), this.height, this.shaft);
  }

  public changeShaftSize(shaft: number){
    if(isNumeric(shaft)){
      if(shaft > 0 && shaft < 101){
        this.shaft = shaft;
        this.visibleShaft = shaft;
        this.updateShaft();
      }
      else
      {
        alert("Shaft needs to be between 1 and 100");      
      }
    }
    else
    {
      alert("Shaft needs to be a number"); 
    }
  }

  public updateShaft(){
    let rowsWereDeleted = false;
    if(this.shaft > this.verCanvasArray[0].length){
      this.addVerRowsToVerCanvasArray();
    }
    else if (this.shaft < this.verCanvasArray[0].length)
    {
      this.removeVerRowsFromCanvasArrays();
      rowsWereDeleted = true;
    }
    if(this.shaft > this.horCanvasArray.length)
    {
      this.addHorRowsToCanvasArrays();
    }
    else if (this.shaft < this.horCanvasArray.length)
    {
      this.removeHorRowsFromCanvasArrays();
      rowsWereDeleted = true;
    }
    
    this.updateHorMaxAndVerMax();

    if(rowsWereDeleted){
      let compressedHorCanvasArray = this.canvasDrawingService.prepareArray(Array(this.width), this.width);
      compressedHorCanvasArray = this.compressService.compressHorCanvasArray(this.horCanvasArray, compressedHorCanvasArray);
      let compressedVerCanvasArray = this.canvasDrawingService.prepareArray(Array(this.height), this.height);
      compressedVerCanvasArray = this.compressService.compressVerCanvasArray(this.verCanvasArray, compressedVerCanvasArray);
      let mainCanvasArray = this.compressService.prepare2DArray(this.height, this.width);
      this.mainCanvasArray = this.compressService.constructMainCanvasArray(compressedVerCanvasArray, compressedHorCanvasArray, this.resultCanvasArray, mainCanvasArray);
      
      this.drawMainCanvas();
    }

    this.drawHorCanvas();
    this.drawVerCanvas();
    this.drawResultCanvas();
  }

  private isMainCanvasEmpty(){
    for(let i = 0; i < this.height; i++){
      for(let j = 0; j < this.width; j++){
        if(this.mainCanvasArray[i][j]){
          return false;
        }
      }
    }
    return true;
  }
  /*private checkIfMainCanvasMatchesSides(){
    let hasAllData = false;
    for(let i = 0; i < this.height; i++){
      for(let j = 0; j < this.width; j++){
        if(this.mainCanvasArray[i][j]){
          for(let a = 0; a < this.horCanvasArray.length; a++){
            if(this.horCanvasArray[a][j]){
              for(let b = 0; b < this.resultCanvasArray.length; b++){
                if(this.resultCanvasArray[a][b]){
                  for(let c = 0; c < this.verCanvasArray[0].length; c++){
                    if(this.verCanvasArray[i][c]){
                    hasAllData = true;
                    break;
                    }
                  hasAllData = false;
                  }
                  break;
                }
                hasAllData = false;
              }
              break;
            }
            hasAllData = false;
          }
          if(!hasAllData){
            this.mainCanvasArray[i][j] = 0;
          }
        }
      }
    }
  }*/

  private addVerRowsToVerCanvasArray(){
    let len = this.shaft - this.verCanvasArray[0].length;
    for(let i = 0; i < len; i++){
      for(let j = 0; j < this.height; j++){
        this.verCanvasArray[j].push(0);
      }
    }
  }

  private removeVerRowsFromCanvasArrays(){
    let len = this.verCanvasArray[0].length - this.shaft;
    this.removeVerRowFromResultCanvasArray(len);
    this.removeVerRowFromVerCanvasArray(len);
  }

  private removeVerRowFromVerCanvasArray(len: number){
    for(let j = 0; j < this.height; j++){
      this.verCanvasArray[j].splice(this.shaft, len);
    }
  }

  private removeVerRowFromResultCanvasArray(len: number){
    for(let i = 0; i < this.verCanvasArray[0].length; i++){
      this.resultCanvasArray[i].splice(this.shaft,len)
    }
  }

  private addHorRowsToCanvasArrays(){
    let len = this.shaft - this.horCanvasArray.length;
    for(let i = this.horCanvasArray.length-1; i >= 0; i--){
      for(let j = 0; j < len; j++){
        this.resultCanvasArray[i].push(0);
      }
    }
    for(let i = 0; i < len; i++){
      this.horCanvasArray.unshift(this.canvasDrawingService.prepareArray(Array(this.width), this.width));
      this.resultCanvasArray.unshift(this.canvasDrawingService.prepareArray(Array(this.horCanvasArray.length),  this.horCanvasArray.length));
    }
  }

  private removeHorRowsFromCanvasArrays(){
    let len = this.horCanvasArray.length - this.shaft;
    this.horCanvasArray.splice(0, len);
    this.resultCanvasArray.splice(0,len);
  }

  public changeRectSize(rectSize: number){
    if(isNumeric(rectSize)){
      if(rectSize > 2 && rectSize < 101){
        this.rectSize = rectSize;
        this.drawCanvases();
      }
      else
      {
        alert("The rectangle size needs to be between 3 and 100");
      }
    }
    else
    {
      alert("The size must be numerical");
    }
  }

  public drawCanvases(){
    this.drawMainCanvas();
    this.drawHorCanvas();
    this.drawVerCanvas();
    this.drawResultCanvas();
    this.drawHorColorCanvas();
    this.drawVerColorCanvas();
  }

  private updateHorMaxAndVerMax(){
    this.horMax = this.shaft;
    this.verMax = this.shaft;
  }

  private drawMainCanvas(){
    let ctx = this.ctxObject.mainCanvas;
    ctx = this.setCanvasWidthAndHeight(ctx, this.width * this.rectSize, this.height * this.rectSize);
    this.updateAllColors(this.width, this.height, ctx, false, this.mainCanvasArray);
  }

  private drawHorCanvas(){
    let ctx = this.ctxObject.horCanvas;
    ctx = this.setCanvasWidthAndHeight(ctx, this.width * this.rectSize, this.horMax * this.rectSize);
    this.drawRects(this.width, this.horMax, ctx, this.defaultWhite, this.horCanvasArray)
  }

  private drawVerCanvas(){
    let ctx = this.ctxObject.verCanvas;
    ctx = this.setCanvasWidthAndHeight(ctx, this.verMax * this.rectSize, this.height * this.rectSize);
    this.drawRects(this.verMax, this.height, ctx, this.defaultWhite, this.verCanvasArray)
  }

  private drawResultCanvas(){
    let ctx = this.ctxObject.resultCanvas;
    ctx = this.setCanvasWidthAndHeight(ctx, this.verMax * this.rectSize, this.horMax * this.rectSize);
    this.drawRects(this.verMax, this.horMax, ctx, this.defaultWhite, this.resultCanvasArray)
  }

  private drawHorColorCanvas(){
    let ctx = this.ctxObject.horColorCanvas;
    ctx = this.setCanvasWidthAndHeight(ctx, this.width * this.rectSize, this.rectSize);
    this.updateAllColors(this.width, 1, ctx);
  }

  private drawVerColorCanvas(){
    let ctx = this.ctxObject.verColorCanvas;
    ctx = this.setCanvasWidthAndHeight(ctx, this.rectSize, this.height * this.rectSize);
    this.updateAllColors(1, this.height, ctx, false)
  }

  private setCanvasWidthAndHeight(ctx: CanvasRenderingContext2D, width, height): CanvasRenderingContext2D{
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    return ctx;
  }

  public presetColorSetterHor(evt){
    if(!evt){
      this.presetColorSetter(this.horCPArray, this.horColor);
    }
  }

  public presetColorSetterVer(evt){
    if(!evt){
      this.presetColorSetter(this.verCPArray, this.verColor)
    }
  }

  private presetColorSetter(presetArray: any[], color: string){
    let len = presetArray.length;
    if(!presetArray.includes(color)){
      presetArray.unshift(color);
      if(len > 5){
        presetArray.splice(6,1);
      }
    }
  }

  public saveCanvas(canvasName: string){
    
    if(!this.isMainCanvasEmpty()){
      if(canvasName.length < 51){
        this.canvasName = canvasName;
        this.save();
      }
      else
      {
        alert("Canvas name must be shorter than 50 characters");
      }
    }
    else
    {
      alert("Cannot save an empty canvas!")
    }
  }

  public save(){
    if(this.canvasName === ""){
      this.canvasName = "koiran karvan kosto " + Math.floor(Math.random() * 10);
    }
    if(this.isDesign){
      this.makeDesign();
    }
    let compressedHorCanvasArray = this.canvasDrawingService.prepareArray(Array(this.width), this.width);
    compressedHorCanvasArray = this.compressService.compressHorCanvasArray(this.horCanvasArray, compressedHorCanvasArray);
    let compressedVerCanvasArray = this.canvasDrawingService.prepareArray(Array(this.height), this.height);
    compressedVerCanvasArray = this.compressService.compressVerCanvasArray(this.verCanvasArray, compressedVerCanvasArray);
    let data = this.compressService.compressColorData(this.horColorArray, this.verColorArray);
    const canvasData = new CanvasDataModel(data.mappedVerColors, data.mappedHorColors, data.colorDataMap, compressedVerCanvasArray, compressedHorCanvasArray, this.resultCanvasArray);
    const canvas = new CanvasModel(this.canvasName, JSON.stringify(canvasData));
    this.canvasService.addCanvas(canvas)
        .subscribe(
          data => alert("Canvas saved!"),
          error => alert("Was not able to save canvas. Are you sure you have less than 10 canvases saved?")
        )
  }

  public loggedIn(){
    return this.auth.loggedIn()
  }

  public mainCanvasListener(evt){
    let ctx = this.ctxObject.mainCanvas;
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    let color = "";
    if(indexY < 0){
      indexY = this.incrementValueByOne(indexY);
    }
    let x =  indexX * this.rectSize;
    let y = indexY * this.rectSize;
    if(this.mainCanvasArray[indexY][indexX]){
      color = this.verColorArray[indexY];
      if(this.isReverse){
        color = this.horColorArray[indexX];
      }
      this.drawRect(x, y, ctx, color);
      this.mainCanvasArray[indexY][indexX] = 0;
    }
    else{
      color = this.horColorArray[indexX];
      if(this.isReverse){
        color = this.verColorArray[indexY];
      }
      this.drawRect(x, y, ctx, color);
      this.mainCanvasArray[indexY][indexX] = 1;
    }
  }

  private incrementValueByOne(index: number){
      return ++index;
  }

  public makeDesign(){
    if(!this.isMainCanvasEmpty()){
      let horUniqueArray = this.fillHorUniqueArray();
      let verUniqueArray = this.fillVerUniqueArray();
      let temp = this.canvasDrawingService.makeDesignArray(horUniqueArray);
      let horArray = temp.array;
      this.horMax = temp.count;
      temp = this.canvasDrawingService.makeDesignArray(verUniqueArray);
      let verArray = temp.array;
      this.verMax = temp.count;

      this.verCanvasArray = this.canvasDrawingService.prepare2DArray(Array(), this.height, this.verMax);
      this.horCanvasArray = this.canvasDrawingService.prepare2DArray(Array(), this.horMax, this.width);
      this.resultCanvasArray = this.canvasDrawingService.prepare2DArray(Array(), this.horMax, this.verMax);

      this.verCanvasArray = this.compressService.decompressVerCanvasArray(verArray, this.verCanvasArray);
      this.horCanvasArray = this.compressService.decompressHorCanvasArray(horArray, this.horCanvasArray);
      this.resultCanvasArray = this.compressService.decompressResultCanvasArray(horArray, verArray, this.mainCanvasArray, this.resultCanvasArray);

      this.drawHorCanvas();
      this.drawVerCanvas();
      this.drawResultCanvas();
    }
    else
    {
      alert("Cannot make design when canvas is empty.");  
    }
  }

  private fillHorUniqueArray(): number[] {
    let horUniqueArray = this.canvasDrawingService.prepareArray(Array(this.width), this.width);
    for(let i = 0; i < this.height; i++){
      for(let j = 0; j < this.width; j++){
        if(this.mainCanvasArray[i][j]){
          horUniqueArray[j] += (i+1) ** 2;
        }
      }
    }
    return horUniqueArray;
  }

  private fillVerUniqueArray(): number[] {
    let verUniqueArray = this.canvasDrawingService.prepareArray(Array(this.height), this.height);
    for(let i = 0; i < this.height; i++){
      for(let j = 0; j < this.width; j++){
        if(this.mainCanvasArray[i][j]){
          verUniqueArray[i] += (j+1) ** 2;
        }
      }
    }
    return verUniqueArray;
  }

  public resultCanvasListener(evt){
    let ctx = this.ctxObject.resultCanvas;
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    if(indexY < 0){
      indexY = this.incrementValueByOne(indexY);
    }
    let x =  indexX * this.rectSize;
    let y = indexY * this.rectSize;
    if(this.resultCanvasArray[indexY][indexX])
    {
      this.drawRect(x, y, ctx, this.defaultWhite)
      this.resultCanvasArray[indexY][indexX] = 0;
    }
    else
    {
      this.drawRect(x, y, ctx, this.defaultGray);
      this.resultCanvasArray[indexY][indexX] = 1;
    }
    this.checkDrawResult(indexX, indexY);
  }

  public horCanvasListener(evt){
    let ctx = this.ctxObject.horCanvas;
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    if(indexY < 0){
      indexY = this.incrementValueByOne(indexY);
    }
    let x =  indexX * this.rectSize;
    let y = indexY * this.rectSize;
    if(this.horCanvasArray[indexY][indexX])
    {
      this.drawRect(x, y, ctx, this.defaultWhite);
      this.horCanvasArray[indexY][indexX] = 0;
    }
    else
    {
      for(let i = 0; i < this.horCanvasArray.length; i++){
        if(this.horCanvasArray[i][indexX] === 1){
          this.horCanvasArray[i][indexX] = 0;
          this.drawRect(x, i * this.rectSize, ctx, this.defaultWhite);
          this.checkDrawHor(indexX, i)
          break;
        }
      }
      this.drawRect(x , y, ctx, this.defaultGray);
      this.horCanvasArray[indexY][indexX] = 1;
    }
    this.checkDrawHor(indexX, indexY);
  }

  private checkDrawHor(indexX: number, indexY: number){
    let ctx = this.ctxObject.mainCanvas;
    let size = this.rectSize;
    let lenRes = this.resultCanvasArray.length;
    let lenHor = this.horCanvasArray[0].length;
    let lenVer = this.verCanvasArray.length;
    let color = "";
    for(let i = 0; i < lenRes; i++){
      if(this.resultCanvasArray[indexY][i]){
        for(let j = 0; j < lenVer; j++){
          if(this.verCanvasArray[j][i]){
            this.mainCanvasArray[j][indexX] = 1 - this.mainCanvasArray[j][indexX];
            for(let b = 0; b < lenHor; b++){
              if(this.mainCanvasArray[j][b]){
                color = this.horColorArray[b];
                if(this.isReverse){
                  color = this.verColorArray[j];
                }
                this.drawRect(b * size, j * size, ctx, color);
              }else{
                color = this.verColorArray[j];
                if(this.isReverse){
                  color = this.horColorArray[b];
                }
                this.drawRect(b * size, j * size, ctx, color);
              }
            }
          }
        }
      }
    }
  }

  private checkDrawResult(indexX: number, indexY: number){
    let ctx = this.ctxObject.mainCanvas;
    let size = this.rectSize;
    let lenHor = this.horCanvasArray[0].length
    let lenVer = this.verCanvasArray.length;
    let color = "";
    for(let i = 0; i < lenHor; i++){
      if(this.horCanvasArray[indexY][i]){
        for(let j = 0; j < lenVer; j++){
          if(this.verCanvasArray[j][indexX]){
            this.mainCanvasArray[j][i] = 1 - this.mainCanvasArray[j][i];
            if(this.mainCanvasArray[j][i]){
              color = this.horColorArray[i];
              if(this.isReverse){
                color = this.verColorArray[j];
              }
              this.drawRect(i * size, j * size, ctx, color);
            }else {
              color = this.verColorArray[j];
              if(this.isReverse){
                color = this.horColorArray[i];
              }
              this.drawRect(i * size, j * size, ctx, color);
            }
          }
        }
      }
    }
  }

  private checkDrawVer(indexX: number, indexY: number){
    let ctx = this.ctxObject.mainCanvas;
    let size = this.rectSize;
    let leni = this.resultCanvasArray.length;
    let lenj = this.horCanvasArray[0].length;
    let lenb = this.verCanvasArray.length;
    let color = "";
    for(let i = 0; i < leni; i++){
      if(this.resultCanvasArray[i][indexX]){
        for(let j = 0; j < lenj; j++){
          if(this.horCanvasArray[i][j]){
            this.mainCanvasArray[indexY][j] = 1 - this.mainCanvasArray[indexY][j];
            for(let b = 0; b < lenb; b++){
              if(this.mainCanvasArray[b][j]){
                color = this.horColorArray[j];
                if(this.isReverse){
                  color = this.verColorArray[b];
                }
                this.drawRect(j * size, b*size, ctx, color);
              }else{
                color = this.verColorArray[b];
                if(this.isReverse){
                  color = this.horColorArray[j];
                }
                this.drawRect(j * size, b*size, ctx, color);
              }
            }
          }
        }
      }
    }
  }

  private isReverse: boolean = false;
  public showReverse(){
    this.isReverse = !this.isReverse;
    this.updateAllColors(this.width, this.height, this.ctxObject.mainCanvas, false, this.mainCanvasArray);
  }

  public addRowsToMainCanvas(evt){
    switch(evt.srcElement.id){
      case "up":
        if(this.height < 501){
          this.addRowAbove();
          this.drawVerRows();
        }
        break;
      case "down":
        if(this.height < 501){
          this.addRowBelow();
          this.drawVerRows();
        }
        break;
      case "left":
        if(this.width < 501){
          this.addRowLeft();
          this.drawHorRows();
        }
        break;
      case "right":
        if(this.width < 501){
          this.addRowRight();
          this.drawHorRows();
        }
        break;
    }
  }

  private addRowAbove(){
    this.mainCanvasArray.unshift(this.canvasDrawingService.prepareArray(Array(this.width), this.width));
    this.verCanvasArray.unshift(this.canvasDrawingService.prepareArray(Array(this.horMax), this.horMax));
    this.verColorArray.unshift(this.verColor);
    this.incrementHeight();
  }
  
  private addRowBelow(){
    this.mainCanvasArray.push(this.canvasDrawingService.prepareArray(Array(this.width), this.width));
    this.verCanvasArray.push(this.canvasDrawingService.prepareArray(Array(this.verMax), this.verMax));
    this.verColorArray.push(this.verColor);
    this.incrementHeight();
  }

  private incrementHeight(){
    this.height++;
    this.visibleHeight = this.height;
  }

  private addRowLeft(){
    for(let i = 0; i < this.height; i++){
      this.mainCanvasArray[i].unshift(0);
    }
    for(let i = 0; i < this.verMax; i++){
      this.horCanvasArray[i].unshift(0);
    }
    this.horColorArray.unshift(this.horColor)
    this.incrementWidth();
  }

  private addRowRight(){
    for(let i = 0; i < this.height; i++){
      this.mainCanvasArray[i].push(0);
    }
    for(let i = 0; i < this.horMax; i++){
      this.horCanvasArray[i].push(0);
    }
    this.horColorArray.push(this.horColor)
    this.incrementWidth();
  }

  private incrementWidth(){
    this.width++;
    this.visibleWidth = this.width;
  }

  public deleteRowsFromMainCanvas(evt){
    switch(evt.srcElement.id){
      case "up":
        if(this.height > 1){
          this.deleteRowAbove();
          this.drawVerRows();
        }
        break;
      case "down":
        if(this.height > 1){
          this.deleteRowBelow();
          this.drawVerRows();
        }
        break;
      case "left":
        if(this.width > 1){
          this.deleteRowLeft();
          this.drawHorRows();
        }
        break;
      case "right":
        if(this.width > 1){
          this.deleteRowRight();
          this.drawHorRows();
        }    
        break;
    }
  }

  private drawHorRows(){
    this.drawMainCanvas();
    this.drawHorCanvas();
    this.drawHorColorCanvas();
  }

  private drawVerRows(){
    this.drawMainCanvas();
    this.drawVerCanvas();
    this.drawVerColorCanvas();
  }

  private deleteRowAbove(){
    this.decrementHeight();
    this.deleteHorRowFromMainCanvasArray(0);
    this.deleteHorRowFromVerCanvasArray(0);
    this.deleteHorRowFromVerColorArray(0);
  }

  private deleteRowBelow(){
    this.decrementHeight();
    this.deleteHorRowFromMainCanvasArray(this.height);
    this.deleteHorRowFromVerCanvasArray(this.height);
    this.deleteHorRowFromVerColorArray(this.height);
  }

  private decrementHeight(){
    this.height--;
    this.visibleHeight = this.height;
  }

  private deleteHorRowFromMainCanvasArray(start: number){
    this.mainCanvasArray.splice(start, 1);
  }

  private deleteHorRowFromVerCanvasArray(start: number){
    this.verCanvasArray.splice(start, 1);
  }

  private deleteHorRowFromVerColorArray(start: number){
    this.verColorArray.splice(start, 1);
  }

  private deleteRowLeft(){
    this.decrementWidth();
    this.deleteVerRowFromMainCanvasArray(0, this.height);
    this.deleteVerRowFromHorCanvasArray(0, this.verMax);
    this.deleteVerRowFromHorColorArray(0);
  }

  private deleteRowRight(){
    this.decrementWidth();
    this.deleteVerRowFromMainCanvasArray(this.width, this.height);
    this.deleteVerRowFromHorCanvasArray(this.width, this.horMax);
    this.deleteVerRowFromHorColorArray(this.width);
  }
  
  private decrementWidth(){
    this.width--;
    this.visibleWidth = this.width;
  }

  private deleteVerRowFromMainCanvasArray(start: number, height: number){
    for(let i = 0; i < height; i++){
      this.mainCanvasArray[i].splice(start, 1);
    }
  }

  private deleteVerRowFromHorCanvasArray(start: number, height){
    for(let i = 0; i < height; i++){
      this.horCanvasArray[i].splice(start, 1);
    }
  }

  private deleteVerRowFromHorColorArray(start: number){
    this.horColorArray.splice(start, 1);
  }

  public verCanvasListener(evt){
    let ctx = this.ctxObject.verCanvas;
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    if(indexY < 0){
      indexY = this.incrementValueByOne(indexY);
    }
    let x =  indexX * this.rectSize;
    let y = indexY * this.rectSize;
    if(this.verCanvasArray[indexY][indexX]){
      this.drawRect(x, y, ctx, this.defaultWhite);
      this.verCanvasArray[indexY][indexX] = 0;
    }
    else{
      for(let i = 0; i < this.verCanvasArray[0].length; i++){
        if(this.verCanvasArray[indexY][i] === 1){
          this.verCanvasArray[indexY][i] = 0;
          this.drawRect(i * this.rectSize, y, ctx, this.defaultWhite);
          this.checkDrawVer(i, indexY);
          break;
        }
      }
      this.drawRect(x, y, ctx, this.defaultGray);
      this.verCanvasArray[indexY][indexX] = 1;
    }
    this.checkDrawVer(indexX, indexY);
  }

  public horColorBarListener(evt){
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let x = indexX * this.rectSize;
    let ctx = this.ctxObject.horColorCanvas;
    this.horColorArray[indexX] = this.horColor;
    this.drawRect(x, 0, ctx, this.horColor);
    this.updateHorColors(indexX);
  }

  public verColorBarListener(evt){
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    if(indexY < 0){
      indexY = this.incrementValueByOne(indexY);
    }
    let y = indexY * this.rectSize;
    let ctx = this.ctxObject.verColorCanvas;
    this.verColorArray[indexY] = this.verColor;
    this.drawRect(0, y, ctx, this.verColor);
    this.updateVerColors(indexY);
  }

  public fillHorColorRow(){
    let ctx = this.ctxObject.horColorCanvas;
    let len = this.horColorArray.length;
    for(let i = 0; i < len; i++){
      this.drawRect(i * this.rectSize, 0, ctx, this.horColor);
      this.horColorArray[i] = this.horColor;
      this.updateHorColors(i);
    }
  }
  
  private updateHorColors(indexX: number){
    let ctx = this.ctxObject.mainCanvas;
    let x = this.rectSize * indexX;
    let color = "";
    for (let b = 0; b < this.height; b++) {
      if (this.mainCanvasArray[b][indexX]){
        color = this.horColorArray[indexX];
        if(this.isReverse){
          color = this.verColorArray[b];
        }
        this.drawRect(x, b * this.rectSize, ctx, color);
      }
      else{
        color = this.verColorArray[b];
        if(this.isReverse){
          color = this.horColorArray[indexX];
        }
        this.drawRect(x, b * this.rectSize, ctx, color);
      }
    }
  }

  public fillVerColorRow(){
    let ctx = this.ctxObject.verColorCanvas;
    let len = this.verColorArray.length;
    for(let i = 0; i < len; i++){
      this.drawRect(0, i * this.rectSize, ctx, this.verColor);
      this.verColorArray[i] = this.verColor;
      this.updateVerColors(i);
    }
  }

  private updateVerColors(indexY: number){
    let ctx = this.ctxObject.mainCanvas;
    let y = this.rectSize * indexY;
    let color = "";
    for (let b = 0; b < this.width; b++) {
      if (!this.mainCanvasArray[indexY][b]){
        color = this.verColorArray[indexY];
        if(this.isReverse){
          color = this.horColorArray[b];
        }
        this.drawRect(b * this.rectSize, y, ctx, color);
      }
      else{
        color = this.horColorArray[b];
        if(this.isReverse){
          color = this.verColorArray[indexY];
        }
        this.drawRect(b * this.rectSize, y, ctx, color);
      }
    }
  }

  private updateAllColors(width: number, height: number, ctx: CanvasRenderingContext2D, isHor: boolean = true,
    array: any[] = null){

    this.refreshCtx(ctx);
    let color = "";
    for (let a = 0; a < height; a++) {
      for (let b = 0; b < width; b++) {
        if(array === null || !array[a][b]){
          if(isHor)
          {
            color = this.horColorArray[b];
            if(this.isReverse){
              color = this.verColorArray[a];
            }
            this.drawRect(b * this.rectSize, a * this.rectSize, ctx, color);
          }
          else
          {
            color = this.verColorArray[a];
            if(this.isReverse){
              color = this.horColorArray[b];
            }
            this.drawRect(b * this.rectSize, a * this.rectSize, ctx, color);
          }
        }
        else if(array !== null && array[a][b]){
          color = this.horColorArray[b];
          if(this.isReverse){
            color = this.verColorArray[a];
          }
          this.drawRect(b * this.rectSize, a * this.rectSize, ctx, color);
        }
      }
    }
  }

  private drawRects(width: number, height: number, ctx: CanvasRenderingContext2D, 
    rectColor: string = this.defaultWhite, array: any[] = null,  secondaryColor: string = this.defaultGray){

    this.refreshCtx(ctx)
    for (let a = 0; a < height; a++) {
      for (let b = 0; b < width; b++) {
        if(array === null || !array[a][b]){
          this.drawRect(b * this.rectSize, a * this.rectSize, ctx, rectColor);
        }
        else if(array !== null && array[a][b]){
          this.drawRect(b * this.rectSize, a * this.rectSize, ctx, secondaryColor);
        }
      }
    }
  }
  
  private drawRect(x: number, y: number, ctx: CanvasRenderingContext2D, color: string){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, this.rectSize, this.rectSize);
    ctx.strokeRect(x, y, this.rectSize, this.rectSize);
  }

  public saveToPng(){
    let tempCanvas = this.renderer2.createElement('canvas');
    let href = this.saveToPngService.saveToPng(this.canvasArray, tempCanvas, this.rectSize, this.padding, this.width, this.height, this.verMax, this.horMax);
    let link = <HTMLLinkElement>document.getElementById('btn-download');
    link.href = href;
  }

  public execute(){
    this.draw();
    this.executeClicked = true;
    localStorage.setItem("isDirty", "true");
  }

  public createNewCanvas(shaft: number, width: number, height: number){
    if(isNumeric(shaft) && isNumeric(width), isNumeric(height)){
      if(shaft > 0 && shaft < 101 && width > 0 && width < 501 && height > 0 && height < 501){
        if(!this.executeClicked){
          this.setNewCanvasDataAndExecute(shaft, width, height);
          return;
        }
        if(!this.isMainCanvasEmpty()){
          if(confirm("Are you sure you want to create new canvas? It will destroy the existing one.")){    
            this.setNewCanvasDataAndExecute(shaft, width, height);
          }
          else
          {
            return;
          }
        }
        this.setNewCanvasDataAndExecute(shaft, width, height);
      }
      else
      {
        alert("The limits are: Shaft between 2 and 100, heddles and lines between 2 and 500");
      }
    }
    else
    {
      alert("Shaft, heddles and lines have to be numbers");
    }
  }

  private setNewCanvasDataAndExecute(shaft: number, width: number, height: number){
    if(this.isDesign)
    {
      this.shaft = 2;
      this.updateHorMaxAndVerMax();
    }
    else
    {
      this.shaft = shaft;
    }
    this.width = width;
    this.height = height;
    this.execute();
  }

  public shareData(){
    if(!this.isMainCanvasEmpty()){
      localStorage.setItem("isDirty", "false");
      if(this.isDesign){
        this.makeDesign();
        this.horMax >= this.verMax ? this.shaft = this.horMax : this.shaft = this.verMax;
        if(this.horMax < this.shaft){
          let len = this.shaft - this.horMax;
          for(let i = 0; i < len; i++){
            this.addHorRowsToCanvasArrays();
          }
        }
        else if(this.verMax < this.shaft){
          let len = this.shaft - this.verMax;
          for(let i = 0; i < len; i++){
            this.addVerRowsToVerCanvasArray();
          }
        }
        this.horMax = this.shaft;
        this.verMax = this.shaft;
      }else{
        this.horMax = this.shaft;
        this.verMax = this.shaft;
      }
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
    }
    else
    {
      localStorage.setItem("canvasIsEmpty", "true");
    }
  }

  ngOnInit() {
    this.initCanvases();
    if(this.hadInitialData){
      this.execute();
    }
    else{
      localStorage.setItem('isDirty', 'false');
    }
  }
}
