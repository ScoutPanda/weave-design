import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { ColorPickerService, Rgba } from 'ngx-color-picker';

import { MyGlobalsService } from '../../services/myglobals.service';

import { AuthService } from '../../services/auth.service';

import { CanvasService } from '../../services/canvas.service';

import { CanvasModel } from '../../services/canvas.model';
import { CanvasDataModel } from '../../services/canvasdata.model';

import { CanvasDrawingService } from './canvas-drawing.service'

import { CanvasCtxInterface } from './canvas-ctx.interface';

import { b64ToBlob } from '../../services/b64-to-blob.service'

@Component({
  selector: 'canvas-drawing',
  templateUrl: './canvas-drawing.component.html',
  styleUrls: ['./canvas-drawing.component.css']
})

export class CanvasDrawingComponent implements OnInit {
  @Input() isDesign: boolean = true;
  private rectArr: any[] = [];

  private mainCanvasArray: any[] = [];
  private resultCanvasArray: any[] = [];
  private verCanvasArray: any[] = [];
  private horCanvasArray: any[] = [];
  private horColorArray: any[] = [];
  private verColorArray: any[] = [];
  private heddlesArray: any[] = [];
  private linesArray: any[] = [];
  private shaftArray: any[] = [];
  private canvasArray: any;
  private horMax: number = 2;
  private verMax: number = 2;

  private horUniqueArray: any[] = [];
  private verUniqueArray: any[] = [];

  private ctxObject = {} as CanvasCtxInterface;

  public heddles: number = 10;
  public lines: number = 10;
  public shaft: number = 2;
  public rectSize: number = 10;

  public horCPArray: any[] = ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'];
  public verCPArray: any[] = ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'];

  public executeClicked: boolean = false;

  //weft = verColor
  //warp = horColor
  public verColor: string = "#fff500";
  public horColor: string = "#F8F8FF";
  public defaultWhite: string = "#F8F8FF";
  public defaultGray: string = "#9E9E9E";

  constructor(
    private auth: AuthService,
    private globals: MyGlobalsService,
    private cpService: ColorPickerService,
    private canvasService: CanvasService,
    private canvasDrawingService: CanvasDrawingService,
    private b64toBlob: b64ToBlob,
    private renderer2: Renderer2
  ) {}

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

  refreshCtx (ctx: CanvasRenderingContext2D): CanvasRenderingContext2D{
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#616161';
    this.ctxObject[ctx.canvas.id] = ctx;
    return ctx;
  }

  public draw(){
    this.verColor = "#fff500";
    this.horColor = "#F8F8FF";
    this.verColorArray = this.canvasDrawingService.prepareColorArray(this.verColorArray, this.lines, this.verColor);
    this.horColorArray = this.canvasDrawingService.prepareColorArray(this.horColorArray, this.heddles, this.horColor);
    this.mainCanvasArray = this.canvasDrawingService.prepare2DArray(this.mainCanvasArray, this.lines, this.heddles);
    this.resultCanvasArray = this.canvasDrawingService.prepare2DArray(this.resultCanvasArray, this.shaft, this.shaft);
    this.horCanvasArray = this.canvasDrawingService.prepare2DArray(this.horCanvasArray, this.shaft, this.heddles);
    this.verCanvasArray = this.canvasDrawingService.prepare2DArray(this.verCanvasArray, this.lines, this.shaft);
    this.verUniqueArray = this.canvasDrawingService.prepareArray(this.verUniqueArray, this.lines);
    this.horUniqueArray = this.canvasDrawingService.prepareArray(this.horUniqueArray, this.heddles);

    let ctxObject = this.ctxObject;

    let ctx = this.ctxObject.mainCanvas
    ctx.canvas.width = this.heddles * this.rectSize;
    ctx.canvas.height = this.lines * this.rectSize;
    this.drawRects(this.heddles, this.lines, ctx, this.verColor);

    ctx = ctxObject.verCanvas;

    ctx.canvas.width = this.shaft * this.rectSize;
    ctx.canvas.height = this.lines * this.rectSize;
    this.drawRects(this.shaft, this.lines, ctx)

    ctx = ctxObject.horCanvas;

    ctx.canvas.width = this.heddles * this.rectSize;
    ctx.canvas.height = this.shaft * this.rectSize;
    this.drawRects(this.heddles, this.shaft, ctx)

    ctx = ctxObject.resultCanvas;

    ctx.canvas.height = this.shaft * this.rectSize;
    ctx.canvas.width = this.shaft * this.rectSize;
    this.drawRects(this.shaft, this.shaft, ctx)

    ctx = ctxObject.verColorCanvas;

    ctx.canvas.height = this.lines * this.rectSize;
    ctx.canvas.width = this.rectSize;
    this.drawRects(1, this.lines, ctx, this.verColor)

    ctx = ctxObject.horColorCanvas;

    ctx.canvas.height = this.rectSize;
    ctx.canvas.width = this.heddles * this.rectSize;
    this.drawRects(this.heddles, 1, ctx, this.horColor);

    this.horMax = this.shaft;
    this.verMax = this.shaft;
  }

  public changeSize(updateShaft: boolean = false){
    if(updateShaft){
      if(this.shaft > this.verCanvasArray[0].length){
        let len = this.shaft - this.verCanvasArray[0].length;
        for(let i = 0; i < len; i++){
          for(let j = 0; j < this.lines; j++){
            this.verCanvasArray[j].push(0);
          }
        }
      }
      else if (this.shaft < this.verCanvasArray[0].length)
      {
        let len = this.verCanvasArray[0].length - this.shaft;
        for(let i = 0; i < this.verCanvasArray[0].length; i++){
          this.resultCanvasArray[i].splice(this.shaft,len)
        }
        for(let j = 0; j < this.lines; j++){
          this.verCanvasArray[j].splice(this.shaft, len);
        }
      }
      if(this.shaft > this.horCanvasArray.length)
      {
        let len = this.shaft - this.horCanvasArray.length;
        for(let i = this.horCanvasArray.length-1; i >= 0; i--){
          for(let j = 0; j < len; j++){
            this.resultCanvasArray[i].push(0);
          }
        }
        for(let i = 0; i < len; i++){
            this.horCanvasArray.unshift(this.canvasDrawingService.prepareArray(Array(this.heddles), this.heddles));
        }
        for(let i = 0; i < len; i++){
          this.resultCanvasArray.unshift(this.canvasDrawingService.prepareArray(Array(this.horCanvasArray.length), this.horCanvasArray.length));
        }
      }
      else if (this.shaft < this.horCanvasArray.length)
      {
        let len = this.horCanvasArray.length - this.shaft;
        this.horCanvasArray.splice(0, len);
        this.resultCanvasArray.splice(0,len);
      }
    }
    if(!this.isDesign){
      this.horMax = this.shaft;
      this.verMax = this.shaft;
    }
    let ctxObject = this.ctxObject;

    let ctx = this.ctxObject.mainCanvas
    ctx.canvas.width = this.heddles * this.rectSize;
    ctx.canvas.height = this.lines * this.rectSize;
    this.updateAllColors(this.heddles, this.lines, ctx, false, this.mainCanvasArray);

    ctx = ctxObject.verCanvas;

    ctx.canvas.width = this.verMax * this.rectSize;
    ctx.canvas.height = this.lines * this.rectSize;
    this.drawRects(this.verMax, this.lines, ctx, this.defaultWhite, this.verCanvasArray)

    ctx = ctxObject.horCanvas;

    ctx.canvas.width = this.heddles * this.rectSize;
    ctx.canvas.height = this.horMax * this.rectSize;
    this.drawRects(this.heddles, this.horMax, ctx, this.defaultWhite, this.horCanvasArray)

    ctx = ctxObject.resultCanvas;

    ctx.canvas.width = this.verMax * this.rectSize;
    ctx.canvas.height = this.horMax * this.rectSize;
    this.drawRects(this.verMax, this.horMax, ctx, this.defaultWhite, this.resultCanvasArray)

    ctx = ctxObject.verColorCanvas;

    ctx.canvas.width = this.rectSize;
    ctx.canvas.height = this.lines * this.rectSize;
    this.updateAllColors(1, this.lines, ctx, false)

    ctx = ctxObject.horColorCanvas;

    ctx.canvas.width = this.heddles * this.rectSize;
    ctx.canvas.height = this.rectSize;
    this.updateAllColors(this.heddles, 1, ctx);
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

  public save(){
    const canvasData = new CanvasDataModel(this.verColorArray, this.horColorArray);
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

  public mainCanvasListener(evt){
    let ctx = this.ctxObject[evt.srcElement.id];
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    let x =  indexX * this.rectSize;
    let y = indexY * this.rectSize;
    if(this.mainCanvasArray[indexY][indexX]){
      ctx.fillStyle = this.verColorArray[indexY].color;
      ctx.fillRect(x,y, this.rectSize, this.rectSize);
      ctx.strokeRect(x,y, this.rectSize, this.rectSize)
      this.mainCanvasArray[indexY][indexX] = 0;
      this.horUniqueArray[indexX] -= (indexY+1) ** 2;
      this.verUniqueArray[indexY] -= (indexX+1) ** 2;
    }
    else{
      ctx.fillStyle = this.horColorArray[indexX].color;
      ctx.fillRect(x, y, this.rectSize, this.rectSize);
      ctx.strokeRect(x,y, this.rectSize, this.rectSize)
      this.mainCanvasArray[indexY][indexX] = 1;
      this.horUniqueArray[indexX] += (indexY+1) ** 2;
      this.verUniqueArray[indexY] += (indexX+1) ** 2;
    }
  }



  public makeDesign(){
    let temp = this.canvasDrawingService.makeDesignArray(this.horUniqueArray);
    let horTaulu = temp.array;
    let horMax = temp.count;
    temp = this.canvasDrawingService.makeDesignArray(this.verUniqueArray);
    let verTaulu = temp.array;
    let verMax = temp.count;

    if(this.verCanvasArray[0].length !== verMax){
      this.verCanvasArray = this.canvasDrawingService.prepare2DArray(this.verCanvasArray, this.lines, verMax);
    }
    if(this.horCanvasArray.length !== horMax){
      this.horCanvasArray = this.canvasDrawingService.prepare2DArray(this.horCanvasArray, horMax, this.heddles);
    }

    for(let i = 0; i < this.lines; i++){
      if(verTaulu[i] <= verMax && verTaulu[i] > 0){
        this.verCanvasArray[i][verTaulu[i]-1] = 1;
      }
    }
    for(let i = 0; i < this.heddles; i++){
      if(horTaulu[i] > 0){
        this.horCanvasArray[horTaulu[i]-1][i] = 1;
      }
    }

    this.resultCanvasArray = this.canvasDrawingService.prepare2DArray(this.resultCanvasArray, horMax, verMax);
    for (let i = 0; i < this.lines; i++) {
      for (let j = 0; j < this.heddles; j++) {
        if (this.mainCanvasArray[i][j] == 1) {
          this.resultCanvasArray[horTaulu[j]-1][verTaulu[i]-1] = 1;
        }
      }
    }

    let ctxObject = this.ctxObject;
    let ctx = ctxObject.verCanvas;

    ctx.canvas.width = verMax * this.rectSize;
    ctx.canvas.height = this.lines * this.rectSize;
    this.drawRects(verMax, this.lines, ctx, this.defaultWhite, this.verCanvasArray)

    ctx = ctxObject.horCanvas;

    ctx.canvas.width = this.heddles * this.rectSize;
    ctx.canvas.height = horMax * this.rectSize;
    this.drawRects(this.heddles, horMax, ctx, this.defaultWhite, this.horCanvasArray)

    ctx = ctxObject.resultCanvas;

    ctx.canvas.height = horMax * this.rectSize;
    ctx.canvas.width = verMax * this.rectSize;
    this.drawRects(verMax, horMax, ctx, this.defaultWhite, this.resultCanvasArray)

    this.horMax = horMax;
    this.verMax = verMax;
  }

  public resultCanvasListener(evt){
    let ctx = this.ctxObject[evt.srcElement.id];
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    let x =  indexX * this.rectSize;
    let y = indexY * this.rectSize;
    if(this.resultCanvasArray[indexY][indexX]){
      ctx.fillStyle = this.defaultWhite;
      ctx.fillRect(x,y, this.rectSize, this.rectSize);
      ctx.strokeRect(x,y, this.rectSize, this.rectSize)
      this.resultCanvasArray[indexY][indexX] = 0;
    }
    else
    {
      ctx.fillStyle = this.defaultGray;
      ctx.fillRect(x, y, this.rectSize, this.rectSize);
      ctx.strokeRect(x,y, this.rectSize, this.rectSize)
      this.resultCanvasArray[indexY][indexX] = 1;
    }
    this.checkDrawResult(indexX, indexY);
  }

  public horCanvasListener(evt){
    let ctx = this.ctxObject[evt.srcElement.id];
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    let x =  indexX * this.rectSize;
    let y = indexY * this.rectSize;
    if(this.horCanvasArray[indexY][indexX]){
      ctx.fillStyle = this.defaultWhite;
      ctx.fillRect(x,y, this.rectSize, this.rectSize);
      ctx.strokeRect(x,y, this.rectSize, this.rectSize)
      this.horCanvasArray[indexY][indexX] = 0;
    }
    else{
      for(let i = 0; i < this.horCanvasArray.length; i++){
        if(this.horCanvasArray[i][indexX] === 1){
          this.horCanvasArray[i][indexX] = 0;
          ctx.fillStyle = this.defaultWhite;
          ctx.fillRect(x, i * this.rectSize, this.rectSize, this.rectSize);
          ctx.strokeRect(x, i * this.rectSize, this.rectSize, this.rectSize)
          this.checkDrawHor(indexX, i)
          break;
        }
      }
      ctx.fillStyle = this.defaultGray;
      ctx.fillRect(x, y, this.rectSize, this.rectSize);
      ctx.strokeRect(x,y, this.rectSize, this.rectSize)
      this.horCanvasArray[indexY][indexX] = 1;
    }
    this.checkDrawHor(indexX, indexY);
  }

  private checkDrawHor(indexX: number, indexY: number){
    let ctx = this.ctxObject["mainCanvas"];
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
                ctx.fillStyle = this.horColorArray[b].color;
                ctx.fillRect(b * size, j * size, size, size);
                ctx.strokeRect(b * size, j * size, size, size);
              }else{
                ctx.fillStyle = this.verColorArray[j].color;
                ctx.fillRect(b * size, j * size, size, size);
                ctx.strokeRect(b * size, j * size, size, size);
              }
            }
          }
        }
      }
    }
  }

  private checkDrawResult(indexX: number, indexY: number){
    let ctx = this.ctxObject["mainCanvas"];
    let size = this.rectSize;
    let lenHor = this.horCanvasArray[0].length
    let lenVer = this.verCanvasArray.length;
    for(let i = 0; i < lenHor; i++){
      if(this.horCanvasArray[indexY][i]){
        for(let j = 0; j < lenVer; j++){
          if(this.verCanvasArray[j][indexX]){
            this.mainCanvasArray[j][i] = 1 - this.mainCanvasArray[j][i];
            if(this.mainCanvasArray[j][i]){
              ctx.fillStyle = this.horColorArray[i].color;
            }else {
              ctx.fillStyle = this.verColorArray[j].color;
            }
            ctx.fillRect(i * size, j * size, size, size);
            ctx.strokeRect(i * size, j * size, size, size);
          }
        }
      }
    }
  }

  private checkDrawVer(indexX: number, indexY: number){
    let ctx = this.ctxObject["mainCanvas"];
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
                ctx.fillStyle = this.horColorArray[j].color;
                ctx.fillRect(j * size, b * size, size, size);
                ctx.strokeRect(j * size, b * size, size, size);
              }else{
                ctx.fillStyle = this.verColorArray[b].color;
                ctx.fillRect(j * size, b * size, size, size);
                ctx.strokeRect(j * size, b * size, size, size);
              }
            }
          }
        }
      }
    }
  }

  public verCanvasListener(evt){
    let ctx = this.ctxObject[evt.srcElement.id];
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    let x =  indexX * this.rectSize;
    let y = indexY * this.rectSize;
    if(this.verCanvasArray[indexY][indexX]){
      ctx.fillStyle = this.defaultWhite;
      ctx.fillRect(x,y, this.rectSize, this.rectSize);
      ctx.strokeRect(x,y, this.rectSize, this.rectSize)
      this.verCanvasArray[indexY][indexX] = 0;
    }
    else{
      for(let i = 0; i < this.verCanvasArray[0].length; i++){
        if(this.verCanvasArray[indexY][i] === 1){
          this.verCanvasArray[indexY][i] = 0;
          ctx.fillStyle = this.defaultWhite;
          ctx.fillRect(i * this.rectSize, y, this.rectSize, this.rectSize);
          ctx.strokeRect(i * this.rectSize, y, this.rectSize, this.rectSize)
          this.checkDrawVer(i, indexY)
          break;
        }
      }
      ctx.fillStyle = this.defaultGray;
      ctx.fillRect(x, y, this.rectSize, this.rectSize);
      ctx.strokeRect(x,y, this.rectSize, this.rectSize)
      this.verCanvasArray[indexY][indexX] = 1;
    }
    this.checkDrawVer(indexX, indexY)
  }

  public colorBarListener(evt, isHor: boolean){
    let indexX = Math.floor(evt.offsetX / this.rectSize);
    let indexY = Math.floor(evt.offsetY / this.rectSize);
    let x = indexX * this.rectSize;
    let y = indexY * this.rectSize;
    let canvas = evt.srcElement;
    let ctx = canvas.getContext("2d");
    if (isHor){
      ctx.fillStyle = this.horColor;
      this.horColorArray[indexX].color = this.horColor;
      ctx.fillRect(x, 0, this.rectSize, this.rectSize);
      ctx.strokeRect(x, 0, this.rectSize, this.rectSize);
    }
    else {
      ctx.fillStyle = this.verColor;
      this.verColorArray[indexY].color = this.verColor;
      ctx.fillRect(0, y, this.rectSize, this.rectSize);
      ctx.strokeRect(0, y, this.rectSize, this.rectSize);
    }
    this.updateColors(indexX,indexY, isHor)
  }

  private fillColorRow(isHor: boolean){
    if(isHor){
      let ctx = this.ctxObject["horColorCanvas"];
      ctx.fillStyle = this.horColor;
      for(let i = 0; i < this.horColorArray.length; i++){
        this.horColorArray[i].color = this.horColor;
        ctx.fillRect(i*this.rectSize, 0, this.rectSize, this.rectSize);
        ctx.strokeRect(i*this.rectSize, 0, this.rectSize, this.rectSize);
        this.updateColors(i, 0, true);
      }
    }
    else{
      let ctx = this.ctxObject["verColorCanvas"];
      ctx.fillStyle = this.verColor;
      for(let i = 0; i < this.verColorArray.length; i++){
        this.verColorArray[i].color = this.verColor;
        ctx.fillRect(0, i*this.rectSize, this.rectSize, this.rectSize);
        ctx.strokeRect(0, i*this.rectSize, this.rectSize, this.rectSize);
        this.updateColors(0, i, false);
      }
    }
  }

  private updateColors(indexX: number, indexY:number, isHor: boolean){
    let ctx = this.ctxObject["mainCanvas"];
    let size = this.rectSize;
    let height = this.lines;
    let width = this.heddles;
    let mainCanvasArray = this.mainCanvasArray;
    if (isHor){
      let x = size * indexX;
      ctx.fillStyle = this.horColorArray[indexX].color;
      for (let b = 0; b < height; b++) {
        if (mainCanvasArray[b][indexX]){
          ctx.fillRect(x, b * size, size, size);
          ctx.strokeRect(x, b * size, size, size);
        }
      }
    }
    else {
      let y = size * indexY;
      ctx.fillStyle = this.verColorArray[indexY].color;
      for (let b = 0; b < width; b++) {
        if (!mainCanvasArray[indexY][b]){
          ctx.fillRect(b * size, y, size, size);
          ctx.strokeRect(b * size, y, size, size);
        }
      }
    }
  }

  private updateAllColors(width: number, height: number, targetCtx: CanvasRenderingContext2D, isHor: boolean = true, array: any[] = null,
     x: number = 0, y: number = 0){
    this.refreshCtx(targetCtx)
    let size: number = this.rectSize;
    for (let a = 0; a < height; a++) {
      for (let b = 0; b < width; b++) {
        if(array === null || array[a][b] === 0){
          if(isHor){targetCtx.fillStyle = this.horColorArray[b].color;}
          else{targetCtx.fillStyle = this.verColorArray[a].color;}
          targetCtx.fillRect(b * size + x, a * size + y, size, size);
          targetCtx.strokeRect(b * size + x, a * size + y, size, size);
        }
        else if(array !== null && array[a][b] === 1){
          targetCtx.fillStyle = this.horColorArray[b].color;
          targetCtx.fillRect(b * size + x, a * size + y, size, size);
          targetCtx.strokeRect(b * size + x, a * size + y, size, size);
        }
      }
    }
  }

  private drawRects(width: number, height: number, targetCtx: CanvasRenderingContext2D, 
    rectColor: string = this.defaultWhite, array: any[] = null,  secondaryColor: string = this.defaultGray,
    x: number = 0, y: number = 0){

    this.refreshCtx(targetCtx)
    let size: number = this.rectSize;
    for (let a = 0; a < height; a++) {
      for (let b = 0; b < width; b++) {
        if(array === null || array[a][b] === 0){
          targetCtx.fillStyle = rectColor;
          targetCtx.fillRect(b * size + x, a * size + y, size, size);
          targetCtx.strokeRect(b * size + x, a * size + y, size, size);
        }
        else if(array !== null && array[a][b] === 1){
          targetCtx.fillStyle = secondaryColor;
          targetCtx.fillRect(b * size + x, a * size + y, size, size);
          targetCtx.strokeRect(b * size + x, a * size + y, size, size);
        }
      }
    }
  }

  public saveToPng(){
    let canvases = this.canvasArray
    let tempCanvas = this.renderer2.createElement('canvas');
    let ctx = tempCanvas.getContext("2d");
    let size = this.rectSize;
    let padding = 5;
    let heddles = this.heddles;
    let shaft = this.shaft;

    let lines = this.lines
    let absolutewidth = size * heddles + padding * 2 + size * this.verMax + size;
    let absoluteheight = size * lines + padding * 2 + size * this.horMax + size;
    ctx.canvas.width = absolutewidth;
    ctx.canvas.height = absoluteheight;
    //ctx.fillStyle = "#fff";
    //ctx.fillRect(0,0, absolutewidth, absoluteheight)
    //let len = canvases.length - 1;
    //ctx.drawImage(canvases[len],0,0)
    
    // Yes, I know it is horrible
    
    ctx.drawImage(canvases[0], 0, 0)
    ctx.drawImage(canvases[1], 0, size + padding)
    ctx.drawImage(canvases[2], heddles * size + padding, size + padding)
    ctx.drawImage(canvases[3], 0, size * this.horMax + size + padding * 2)
    ctx.drawImage(canvases[4], heddles * size + padding, size * this.horMax + size + padding * 2)
    ctx.drawImage(canvases[5], heddles * size + padding * 2 + size * this.verMax, size * this.horMax + size + padding * 2)
    var base64 = tempCanvas.toDataURL();
    let blob = this.b64toBlob.ToBlob(base64);


    let link = <HTMLLinkElement>document.getElementById('btn-download')
    link.href = URL.createObjectURL(blob);
  }

  public execute(){
    this.draw();
    this.executeClicked = true
  }

  ngOnInit() {
    this.initCanvas();
  }
}
