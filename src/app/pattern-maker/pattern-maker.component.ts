import { Component, OnInit } from '@angular/core';
import { ColorPickerService, Rgba } from 'ngx-color-picker';

import { MyGlobalsService } from '../services/myglobals.service';

enum ColorOrientation {
  ver = 0,
  hor = 1
}

interface canvasCtxInterface {
  nwCanvas: CanvasRenderingContext2D,
  neCanvas: CanvasRenderingContext2D,
  swCanvas: CanvasRenderingContext2D,
  seCanvas: CanvasRenderingContext2D,
  verColorCanvas: CanvasRenderingContext2D,
  horColorCanvas: CanvasRenderingContext2D,
  length: number
}

@Component({
  selector: 'app-pattern-maker',
  templateUrl: './pattern-maker.component.html',
  styleUrls: ['./pattern-maker.component.css']
})

export class PatternMakerComponent implements OnInit {
  private rectArr: any[] = [];

  private seCanvasArray: any[] = [];
  private neCanvasArray: any[] = [];
  private swCanvasArray: any[] = [];
  private array: any[] = [];
  private colorArray: any[] = [];
  private heddlesArray: any[] = [];
  private linesArray: any[] = [];
  private shaftArray: any[] = [];

  private ctxObject = {} as canvasCtxInterface;

  public heddles: number = 10;
  public lines: number = 10;
  public shaft: number = 2;
  public rectSize: number = 10;

  public horCPArray: any[] = ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'];
  public verCPArray: any[] = ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'];

  public executeClicked: boolean = false;
  ColorOrientation : typeof ColorOrientation = ColorOrientation;

  //weft = verColor
  //warp = horColor
  public verColor: string = "#fff500";
  public horColor: string = "#F8F8FF";
  public defaultWhite: string = "#F8F8FF";
  public defaultGray: string = "#9E9E9E";

  constructor(
    private globals: MyGlobalsService,
    private cpService: ColorPickerService,
  ) {}

  public initCanvas(){
    let canvasArray = document.getElementsByTagName('canvas');
    let len = canvasArray.length;
    let ctxObject = this.ctxObject;
    let ctx: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    ctxObject.length = len;
    for(let i = 0; i < len; i++){
      canvas = <HTMLCanvasElement>canvasArray[i];
      ctx = canvas.getContext("2d");
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#616161';
      ctxObject[canvas.id] = ctx;
    }
    this.ctxObject = ctxObject;
  }

  refreshCtx (ctx: CanvasRenderingContext2D): CanvasRenderingContext2D{
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#616161';
    this.ctxObject[ctx.canvas.id] = ctx;
    return ctx;
  }

  public prepareArray(array: any, height: number, width: number): any{
    array = Array(height);
    for (let a = 0; a < height; a++){
      array[a] = Array(width);
      for (let b = 0; b < width; b++){
        array[a][b] = 0;
      }
    }
    return array;
  }

  public prepareColorArray(){
    let horColor = this.horColor;
    let verColor = this.verColor;
    let colorArray = this.colorArray;
    let lines = this.lines;
    let heddles = this.heddles;
    let cHor = this.ColorOrientation.hor;
    let cVer = this.ColorOrientation.ver;
    colorArray[cVer] = [];
    let i: number;
    for (i = 0; i < lines; i++){
      colorArray[cVer][i] = {
        color: verColor
      };
    }
    colorArray[cHor] = [];
    for (i = 0; i < heddles; i++){
      colorArray[cHor][i] = {
        color: horColor
      };
    }
  }

  public draw(){
    this.prepareColorArray();
    this.seCanvasArray = this.prepareArray(this.seCanvasArray, this.shaft, this.shaft);
    this.swCanvasArray = this.prepareArray(this.swCanvasArray, this.shaft, this.heddles);
    this.neCanvasArray = this.prepareArray(this.neCanvasArray, this.lines, this.shaft);

    console.log(this.seCanvasArray)
    console.log(this.swCanvasArray)
    console.log(this.neCanvasArray)

    let ctxObject = this.ctxObject;

    let ctx = this.ctxObject.nwCanvas
    ctx.canvas.width = this.heddles * this.rectSize;
    ctx.canvas.height = this.lines * this.rectSize;
    ctx = this.refreshCtx(ctx);
    this.drawRects(0, 0, this.heddles, this.lines, this.verColor, ctx);

    ctx = ctxObject.neCanvas;

    ctx.canvas.width = this.shaft * this.rectSize;
    ctx.canvas.height = this.lines * this.rectSize;
    ctx = this.refreshCtx(ctx);
    this.drawRects(0, 0, this.shaft, this.lines, this.defaultWhite, ctx)

    ctx = ctxObject.swCanvas;

    ctx.canvas.width = this.heddles * this.rectSize;
    ctx.canvas.height = this.shaft * this.rectSize;
    ctx = this.refreshCtx(ctx);
    this.drawRects(0, 0, this.heddles, this.shaft, this.defaultWhite, ctx)

    ctx = ctxObject.seCanvas;

    ctx.canvas.height = this.shaft * this.rectSize;
    ctx.canvas.width = this.shaft * this.rectSize;
    ctx = this.refreshCtx(ctx);
    this.drawRects(0, 0, this.shaft, this.shaft, this.defaultWhite, ctx)

    ctx = ctxObject.verColorCanvas;

    ctx.canvas.height = this.lines * this.rectSize;
    ctx.canvas.width = this.rectSize;
    ctx = this.refreshCtx(ctx);
    this.drawRects(0 ,0 ,1, this.lines, this.verColor, ctx)

    ctx = ctxObject.horColorCanvas;

    ctx.canvas.height = this.rectSize;
    ctx.canvas.width = this.heddles * this.rectSize;
    ctx = this.refreshCtx(ctx);
    this.drawRects(0, 0, this.heddles, 1, this.horColor, ctx);

  }

  public presetColorSetter(evt, isHor: boolean){
    if(!evt){
      if(isHor){
        let presetArray = this.horCPArray;
        let len = presetArray.length;
        let horColor = this.horColor;
        if(!presetArray.includes(horColor)){
          presetArray.unshift(horColor);
          if(len > 5){
            presetArray.splice(6,1);
          }
        }
      }
      else {
        let presetArray = this.verCPArray;
        let len = presetArray.length;
        let verColor = this.verColor;
        if(!presetArray.includes(verColor)){
          presetArray.unshift(verColor);
          if(len > 5){
            presetArray.splice(6,1);
          }
        }
      }
    }
  }

  public seCanvasListener(evt){
    let ctx = this.ctxObject[evt.srcElement.id];
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    let x =  indexX * this.rectSize;
    let y = indexY * this.rectSize;
    if(this.seCanvasArray[indexY][indexX]){
      ctx.fillStyle = this.defaultWhite;
      ctx.fillRect(x,y, this.rectSize, this.rectSize);
      ctx.strokeRect(x,y, this.rectSize, this.rectSize)
      this.seCanvasArray[indexY][indexX] = 0;
    }
    else{
      ctx.fillStyle = this.defaultGray;
      ctx.fillRect(x, y, this.rectSize, this.rectSize);
      ctx.strokeRect(x,y, this.rectSize, this.rectSize)
      this.seCanvasArray[indexY][indexX] = 1;
    }
  }

  public swCanvasListener(evt){
    let ctx = this.ctxObject[evt.srcElement.id];
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    let x =  indexX * this.rectSize;
    let y = indexY * this.rectSize;
    if(this.swCanvasArray[indexY][indexX]){
      ctx.fillStyle = this.defaultWhite;
      ctx.fillRect(x,y, this.rectSize, this.rectSize);
      ctx.strokeRect(x,y, this.rectSize, this.rectSize)
      this.swCanvasArray[indexY][indexX] = 0;
    }
    else{
      ctx.fillStyle = this.defaultGray;
      ctx.fillRect(x, y, this.rectSize, this.rectSize);
      ctx.strokeRect(x,y, this.rectSize, this.rectSize)
      this.swCanvasArray[indexY][indexX] = 1;
    }
  }

  public neCanvasListener(evt){
    let ctx = this.ctxObject[evt.srcElement.id];
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    let x =  indexX * this.rectSize;
    let y = indexY * this.rectSize;
    if(this.neCanvasArray[indexY][indexX]){
      ctx.fillStyle = this.defaultWhite;
      ctx.fillRect(x,y, this.rectSize, this.rectSize);
      ctx.strokeRect(x,y, this.rectSize, this.rectSize)
      this.neCanvasArray[indexY][indexX] = 0;
    }
    else{
      ctx.fillStyle = this.defaultGray;
      ctx.fillRect(x, y, this.rectSize, this.rectSize);
      ctx.strokeRect(x,y, this.rectSize, this.rectSize)
      this.neCanvasArray[indexY][indexX] = 1;
    }
  }

  public colorBarListener(evt, isHor: boolean){
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    let x = indexX * this.rectSize;
    let y = indexY * this.rectSize;
    let cHor = ColorOrientation.hor;
    let cVer = ColorOrientation.ver;
    let canvas = evt.srcElement;
    let ctx = canvas.getContext("2d");
    // orient true = hor false = ver
    if (isHor){
      ctx.fillStyle = this.horColor;
      this.colorArray[cHor][indexX].color = this.horColor;
      ctx.fillRect(x, 0, this.rectSize, this.rectSize);
      ctx.strokeRect(x, 0, this.rectSize, this.rectSize);
    }
    else {
      ctx.fillStyle = this.verColor;
      this.colorArray[cVer][indexY].color = this.verColor;
      ctx.fillRect(0, y, this.rectSize, this.rectSize);
      ctx.strokeRect(0, y, this.rectSize, this.rectSize);
    }
    //this.updateColors(x, y, indexX,indexY, isHor)
  }

  /*public updateColors(x: number, y: number, indexX: number, indexY:number, isHor: boolean){
    let ctx = this.ctxObject["nwCanvas"];
    let size = this.rectSize;
    let height = this.lines;
    let width = this.heddles;
    let array = this.array;
    let cHor = ColorOrientation.hor;
    let cVer = ColorOrientation.ver;
    if (isHor){
      ctx.fillStyle = this.colorArray[cHor][indexX].color;
      for (let b = 0; b < height; b++) {
        if (array[b][indexX]){
          ctx.fillRect(size * indexX, b * size + y, size, size);
          ctx.strokeRect(size * indexX, b * size + y, size, size);
        }
      }
    }
    else {
      ctx.fillStyle = this.colorArray[cVer][indexX].color;
      for (let b = 0; b < width; b++) {
        if (!array[indexY][b]){
          ctx.fillRect(b * size + x, size * indexY, size, size);
          ctx.strokeRect(b * size + x, size * indexY, size, size);
        }
      }
    }
  }*/

  public drawRects(x: number, y: number, width: number, height: number, rectColor: string, targetCtx: CanvasRenderingContext2D){
    let size: number = this.rectSize;
    for (let a = 0; a < height; a++) {
      for (let b = 0; b < width; b++) {
        targetCtx.fillStyle = rectColor;
        targetCtx.fillRect(b * size + x, a * size + y, size, size);
        targetCtx.strokeRect(b * size + x, a * size + y, size, size);
      }
    }
  }

  public execute(){
    this.draw();
    this.executeClicked = true
  }

  ngOnInit() {
    this.initCanvas();
  }

}

