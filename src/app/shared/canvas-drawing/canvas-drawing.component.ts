import { Component, OnInit, Input, Renderer2 } from '@angular/core';

import { AuthService } from '../../services/auth.service';

import { CanvasService } from '../../services/canvas.service';

import { CanvasModel } from '../../services/canvas.model';
import { CanvasDataModel } from '../../services/canvasdata.model';

import { CanvasDrawingService } from './canvas-drawing.service'

import { CanvasCtxInterface } from './canvas-ctx.interface';

import { SaveToPngService } from '../../services/savetopng.service';

import { SharedDataService } from '../../services/shareddata.service';

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

  private ctxObject = {} as CanvasCtxInterface;

  private hadInitialData: boolean = false;

  public width: number = 10;
  public height: number = 10;
  public shaft: number = 2;
  public rectSize: number = 10;

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

  constructor(
    private auth: AuthService,
    private canvasService: CanvasService,
    private canvasDrawingService: CanvasDrawingService,
    private saveToPngService: SaveToPngService,
    private renderer2: Renderer2,
    private shareddata: SharedDataService
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
      this.horCPArray = this.shareddata.horCPArray;
      this.verCPArray = this.shareddata.verCPArray;
      this.shareddata.hasInitialData = false;
      this.hadInitialData = true;
    }
  }

  public initCanvas(){
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
      this.horColor = this.defaultHorColor;
      this.verColor = this.defaultVerColor;
      this.verColorArray = this.canvasDrawingService.prepareColorArray(this.verColorArray, this.height, this.verColor);
      this.horColorArray = this.canvasDrawingService.prepareColorArray(this.horColorArray, this.width, this.horColor);
      this.mainCanvasArray = this.canvasDrawingService.prepare2DArray(this.mainCanvasArray, this.height, this.width);
      this.resultCanvasArray = this.canvasDrawingService.prepare2DArray(this.resultCanvasArray, this.shaft, this.shaft);
      this.horCanvasArray = this.canvasDrawingService.prepare2DArray(this.horCanvasArray, this.shaft, this.width);
      this.verCanvasArray = this.canvasDrawingService.prepare2DArray(this.verCanvasArray, this.height, this.shaft);
    }
    this.drawCanvases();

    this.updateHorMaxAndVerMax();

    this.hadInitialData = false;
  }

  public updateShaft(){
    if(this.shaft > this.verCanvasArray[0].length){
      this.addVerRowsToVerCanvasArray();
    }
    else if (this.shaft < this.verCanvasArray[0].length)
    {
      this.removeVerRowsFromCanvasArrays();
    }
    if(this.shaft > this.horCanvasArray.length)
    {
      this.addHorRowsToCanvasArrays();
    }
    else if (this.shaft < this.horCanvasArray.length)
    {
      this.removeHorRowsFromCanvasArrays();
    }

    this.updateHorMaxAndVerMax();
    this.drawHorCanvas();
    this.drawVerCanvas();
    this.drawResultCanvas();
  }

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

  public save(){
    let compressedHorCanvasArray = this.compressHorCanvasArray(this.horCanvasArray);
    let compressedVerCanvasArray = this.compressVerCanvasArray(this.verCanvasArray);
    const canvasData = new CanvasDataModel(this.verColorArray, this.horColorArray, compressedVerCanvasArray, compressedHorCanvasArray, this.resultCanvasArray);
    const canvas = new CanvasModel('koira', JSON.stringify(canvasData));
    this.canvasService.addCanvas(canvas)
        .subscribe(
          data => console.log(data),
          error => console.log(error)
        )
  }

  public loggedIn(){
    return this.auth.loggedIn()
  }

  public koira(){
    console.log(this.compressHorCanvasArray(this.horCanvasArray));
    console.log(this.compressVerCanvasArray(this.verCanvasArray));
  }

  private compressVerCanvasArray(array: any[]): number[]{
    let height = array.length;
    let width = array[0].length;
    let retArray = this.canvasDrawingService.prepareArray(Array(height), height);
    for(let i = 0; i < height; i++){
      for(let j = 0; j < width; j++){
        if(array[i][j]){
          retArray[i] = j + 1;
        }
      }
    }
    return retArray;
  }

  private compressHorCanvasArray(array: any[]): number[]{
    let height = array.length;
    let width = array[0].length;
    let retArray = this.canvasDrawingService.prepareArray(Array(width), width);
    for(let i = 0; i < height; i++){
      for(let j = 0; j < width; j++){
        if(array[i][j]){
          retArray[j] = i + 1;
        }
      }
    }
    return retArray;
  }

  public mainCanvasListener(evt){
    let ctx = this.ctxObject.mainCanvas;
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    let x =  indexX * this.rectSize;
    let y = indexY * this.rectSize;
    if(this.mainCanvasArray[indexY][indexX]){
      this.drawRect(x, y, ctx, this.verColorArray[indexY]);
      this.mainCanvasArray[indexY][indexX] = 0;
    }
    else{
      this.drawRect(x, y, ctx, this.horColorArray[indexX]);
      this.mainCanvasArray[indexY][indexX] = 1;
    }
  }

  public makeDesign(){
    let horUniqueArray = this.fillHorUniqueArray();
    let verUniqueArray = this.fillVerUniqueArray();
    let temp = this.canvasDrawingService.makeDesignArray(horUniqueArray);
    let horArray = temp.array;
    this.horMax = temp.count;
    temp = this.canvasDrawingService.makeDesignArray(verUniqueArray);
    let verArray = temp.array;
    this.verMax = temp.count;

    if(this.verCanvasArray[0].length !== this.verMax){
      this.verCanvasArray = this.canvasDrawingService.prepare2DArray(this.verCanvasArray, this.height, this.verMax);
    }
    if(this.horCanvasArray.length !== this.horMax){
      this.horCanvasArray = this.canvasDrawingService.prepare2DArray(this.horCanvasArray, this.horMax, this.width);
    }
    if(this.resultCanvasArray.length !== this.verMax || this.resultCanvasArray[0].length !== this.horMax){
      this.resultCanvasArray = this.canvasDrawingService.prepare2DArray(this.resultCanvasArray, this.horMax, this.verMax);
    }

    console.log(verArray)
    console.log(horArray)

    this.createVerCanvasArray(verArray);
    this.createHorCanvasArray(horArray);
    this.createResultCanvasArray(horArray, verArray);

    this.drawHorCanvas();
    this.drawVerCanvas();
    this.drawResultCanvas();
  }

  private createVerCanvasArray(verArray: number[]){
    for(let i = 0; i < this.height; i++){
      if(verArray[i] <= this.verMax && verArray[i] > 0){
        this.verCanvasArray[i][verArray[i]-1] = 1;
      }
    }
  }

  private createHorCanvasArray(horArray: number[]){
    for(let i = 0; i < this.width; i++){
      if(horArray[i] > 0){
        this.horCanvasArray[horArray[i]-1][i] = 1;
      }
    }
  }

  private createResultCanvasArray(horArray: number[], verArray: number[]){
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.mainCanvasArray[i][j] == 1) {
          this.resultCanvasArray[horArray[j]-1][verArray[i]-1] = 1;
        }
      }
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
    for(let i = 0; i < lenRes; i++){
      if(this.resultCanvasArray[indexY][i]){
        for(let j = 0; j < lenVer; j++){
          if(this.verCanvasArray[j][i]){
            this.mainCanvasArray[j][indexX] = 1 - this.mainCanvasArray[j][indexX];
            for(let b = 0; b < lenHor; b++){
              if(this.mainCanvasArray[j][b]){
                this.drawRect(b * size, j * size, ctx, this.horColorArray[b]);
              }else{
                this.drawRect(b * size, j * size, ctx, this.verColorArray[j]);
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
    for(let i = 0; i < lenHor; i++){
      if(this.horCanvasArray[indexY][i]){
        for(let j = 0; j < lenVer; j++){
          if(this.verCanvasArray[j][indexX]){
            this.mainCanvasArray[j][i] = 1 - this.mainCanvasArray[j][i];
            if(this.mainCanvasArray[j][i]){
              this.drawRect(i * size, j * size, ctx, this.horColorArray[i]);
            }else {
              this.drawRect(i * size, j * size, ctx, this.verColorArray[j]);
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
    for(let i = 0; i < leni; i++){
      if(this.resultCanvasArray[i][indexX]){
        for(let j = 0; j < lenj; j++){
          if(this.horCanvasArray[i][j]){
            this.mainCanvasArray[indexY][j] = 1 - this.mainCanvasArray[indexY][j];
            for(let b = 0; b < lenb; b++){
              if(this.mainCanvasArray[b][j]){
                this.drawRect(j * size, b*size, ctx, this.horColorArray[j]);
              }else{
                this.drawRect(j * size, b*size, ctx, this.verColorArray[b]);
              }
            }
          }
        }
      }
    }
  }

  private isReverse: boolean = false;
  public showReverse(){
    this.updateAllColors(this.width, this.height, this.ctxObject.mainCanvas, false, this.mainCanvasArray);
    this.isReverse = !this.isReverse;
  }

  public addRowsToMainCanvas(evt){
    switch(evt.srcElement.id){
      case "up":
        this.addRowAbove();
        this.drawVerRows();
        break;
      case "down":
        this.addRowBelow();
        this.drawVerRows();
        break;
      case "left":
        this.addRowLeft();
        this.drawHorRows();
        break;
      case "right":
        this.addRowRight();
        this.drawHorRows();
        break;
    }
  }

  private addRowAbove(){
    this.mainCanvasArray.unshift(this.canvasDrawingService.prepareArray(Array(this.width), this.width));
    this.verCanvasArray.unshift(this.canvasDrawingService.prepareArray(Array(this.horMax), this.horMax));
    this.verColorArray.unshift(this.verColor);
    this.height++;
  }
  
  private addRowBelow(){
    this.mainCanvasArray.push(this.canvasDrawingService.prepareArray(Array(this.width), this.width));
    this.verCanvasArray.push(this.canvasDrawingService.prepareArray(Array(this.verMax), this.verMax));
    this.verColorArray.push(this.verColor);
    this.height++;
  }

  private addRowLeft(){
    for(let i = 0; i < this.height; i++){
      this.mainCanvasArray[i].unshift(0);
    }
    for(let i = 0; i < this.verMax; i++){
      this.horCanvasArray[i].unshift(0);
    }
    this.horColorArray.unshift(this.horColor)
    this.width++;
  }

  private addRowRight(){
    for(let i = 0; i < this.height; i++){
      this.mainCanvasArray[i].push(0);
    }
    for(let i = 0; i < this.horMax; i++){
      this.horCanvasArray[i].push(0);
    }
    this.horColorArray.push(this.horColor)
    this.width++;
  }

  public deleteRowsFromMainCanvas(evt){
    switch(evt.srcElement.id){
      case "up":
        this.deleteRowAbove();
        this.drawVerRows();
        break;
      case "down":
        this.deleteRowBelow();
        this.drawVerRows();
        break;
      case "left":
        this.deleteRowLeft();
        this.drawHorRows();
        break;
      case "right":
        this.deleteRowRight();
        this.drawHorRows();    
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
    this.height--;
    this.deleteHorRowFromMainCanvasArray(0);
    this.deleteHorRowFromVerCanvasArray(0);
    this.deleteHorRowFromVerColorArray(0);
  }

  private deleteRowBelow(){
    this.height--;
    this.deleteHorRowFromMainCanvasArray(this.height);
    this.deleteHorRowFromVerCanvasArray(this.height);
    this.deleteHorRowFromVerColorArray(this.height);
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
    this.width--;
    this.deleteVerRowFromMainCanvasArray(0, this.height);
    this.deleteVerRowFromHorCanvasArray(0, this.verMax);
    this.deleteVerRowFromHorColorArray(0);
  }

  private deleteRowRight(){
    this.width--;
    this.deleteVerRowFromMainCanvasArray(this.width, this.height);
    this.deleteVerRowFromHorCanvasArray(this.width, this.horMax);
    this.deleteVerRowFromHorColorArray(this.width);
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
          this.checkDrawVer(i, indexY)
          break;
        }
      }
      this.drawRect(x, y, ctx, this.defaultGray);
      this.verCanvasArray[indexY][indexX] = 1;
    }
    this.checkDrawVer(indexX, indexY)
  }

  public horColorBarListener(evt){
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let x = indexX * this.rectSize;
    let ctx = this.ctxObject.horColorCanvas;
    this.horColorArray[indexX] = this.horColor;
    this.drawRect(x, 0, ctx, this.horColor);
    this.updateHorColors(indexX)
  }

  public verColorBarListener(evt){
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    let y = indexY * this.rectSize;
    let ctx = this.ctxObject.verColorCanvas;
    this.verColorArray[indexY] = this.verColor;
    this.drawRect(0, y, ctx, this.verColor);
    this.updateVerColors(indexY)
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

  public fillVerColorRow(){
    let ctx = this.ctxObject.verColorCanvas;
    let len = this.verColorArray.length;
    for(let i = 0; i < len; i++){
      this.drawRect(0, i * this.rectSize, ctx, this.verColor);
      this.verColorArray[i] = this.verColor;
      this.updateVerColors(i);
    }
  }
  
  private updateHorColors(indexX: number){
    let ctx = this.ctxObject.mainCanvas;
    let x = this.rectSize * indexX;
    let color = this.horColorArray[indexX];
    for (let b = 0; b < this.height; b++) {
      if (this.mainCanvasArray[b][indexX]){
        this.drawRect(x, b * this.rectSize, ctx, color);
      }
    }
  }

  private updateVerColors(indexY: number){
    let ctx = this.ctxObject.mainCanvas;
    let y = this.rectSize * indexY;
    let color = this.verColorArray[indexY];
    for (let b = 0; b < this.width; b++) {
      if (!this.mainCanvasArray[indexY][b]){
        this.drawRect(b * this.rectSize, y, ctx, color);
      }
    }
  }

  private updateAllColors(width: number, height: number, ctx: CanvasRenderingContext2D, isHor: boolean = true,
    array: any[] = null){

    this.refreshCtx(ctx)
    for (let a = 0; a < height; a++) {
      for (let b = 0; b < width; b++) {
        if(array === null || !array[a][b]){
          if(isHor)
          {
            this.drawRect(b * this.rectSize, a * this.rectSize, ctx, this.horColorArray[b]);
          }
          else
          {
            this.drawRect(b * this.rectSize, a * this.rectSize, ctx, this.verColorArray[a]);
          }
        }
        else if(array !== null && array[a][b]){
          this.drawRect(b * this.rectSize, a * this.rectSize, ctx, this.horColorArray[b]);
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
    let link = <HTMLLinkElement>document.getElementById('btn-download')
    link.href = href;
  }

  public execute(){
    this.draw();
    this.executeClicked = true;
  }

  public shareData(){
    if(this.isDesign){
      this.makeDesign();
      this.horMax >= this.verMax ? this.shaft = this.horMax : this.shaft = this.verMax;
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

  ngOnInit() {
    this.initCanvas();
    if(this.hadInitialData){
      this.execute();
    }
  }
}
