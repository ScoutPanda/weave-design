import { Injectable } from '@angular/core';
import { ColorPickerService, Rgba } from 'ngx-color-picker';

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

@Injectable()
export class DrawService {

  private rectArr: any[] = [];

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

  public executeClicked: boolean = false;
  ColorOrientation : typeof ColorOrientation = ColorOrientation;

  //weft = verColor
  //warp = horColor
  public verColor: string = "#fff500";
  public horColor: string = "#F8F8FF";
  public defaultWhite: string = "#F8F8FF";
  public defaultGray: string = "#E0E0E0";

  constructor(
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
  
  public prepareArray(){
    let lines = this.lines;
    let heddles = this.heddles;
    let array: any = Array(lines);
    for (let a = 0; a < lines; a++) {
      array[a] = Array(heddles);
      for (let b = 0; b < heddles; b++) {
        array[a][b] = 0;
      }
    }
    this.array = array;
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
    this.colorArray = colorArray;
  }

  public draw(){
    // initCanvas temp solution, should refactor all to one function
    this.prepareColorArray();
    this.prepareArray();

    let ctxObject = this.ctxObject;
    console.log(ctxObject)

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

  public nwCanvasListener(evt){
    let ctx = this.ctxObject[evt.srcElement.id];
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    let x =  indexX * this.rectSize;
    let y = indexY * this.rectSize;
    let cHor = ColorOrientation.hor;
    let cVer = ColorOrientation.ver;
    if(this.array[indexY][indexX]){
      ctx.fillStyle = this.colorArray[cVer][indexY].color;
      ctx.fillRect(x,y, this.rectSize, this.rectSize);
      ctx.strokeRect(x,y, this.rectSize, this.rectSize)
      this.array[indexY][indexX] = 0;
    }
    else{
      ctx.fillStyle = this.colorArray[cHor][indexX].color;
      ctx.fillRect(x, y, this.rectSize, this.rectSize);
      ctx.strokeRect(x,y, this.rectSize, this.rectSize)
      this.array[indexY][indexX] = 1;
    }
    this.updateConstructData(indexX,indexY)
  }

  public updateConstructData(indexX: number, indexY: number) {
    
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
    this.updateColors(x, y, indexX,indexY, isHor)
  }

  public updateColors(x: number, y: number, indexX: number, indexY:number, isHor: boolean){
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
  }

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

}
