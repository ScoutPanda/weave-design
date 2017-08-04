import { Component, OnInit } from '@angular/core';
import { ColorPickerService, Rgba } from 'ngx-color-picker';

import { MyGlobalsService } from '../services/myglobals.service';

enum ColorOrientation {
  ver = 0,
  hor = 1
}

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css']
})

export class DesignComponent implements OnInit {
  private rectArr: any[];

  private array: any[];
  private colorArray: any[];

  private heddles: number = 10;
  private lines: number = 10;
  private shaft: number = 2;
  private rectSize: number = 10;

  public executeClicked: boolean;
  ColorOrientation : typeof ColorOrientation = ColorOrientation;

  //weft = verColor
  //warp = horColor
  public verColor: string = "#fff500";
  public horColor: string = "#F8F8FF";
  public defaultWhite: string = "#F8F8FF";
  public defaultGray: string = "#E0E0E0";

  constructor(
    private globals: MyGlobalsService,
    private cpService: ColorPickerService,
  ) {
    this.rectArr = [];
    this.array = [];
    this.colorArray = [];
    this.executeClicked = false;
  }

  public initCanvas(){
    let canvasArray = document.getElementsByTagName('canvas');
    let len = canvasArray.length;
    for(let i = 0; i < len; i++){
      let canvas = <HTMLCanvasElement>canvasArray[i];
      let ctx = canvas.getContext("2d");
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#616161';
    }
  }
  
  public prepareArray(){
      let array: any = Array(10);
      for (let a = 0; a < this.heddles; a++) {
        array[a] = Array(10);
        for (let b = 0; b < this.lines; b++) {
          array[a][b] = 0;
        }
      }
      this.array = array;
  }

  public prepareColorArray(){
    let horColor = this.horColor;
    let verColor = this.verColor;
    let colorArray = this.colorArray;
    for (let a = 0; a < 2; a++) {
        colorArray[a] = [];
        if (a === 0){
          for (let b = 0; b < this.lines; b++){
            colorArray[a][b] = {
              color: verColor
            };
          }
        }
        else {
          for (let b = 0; b < this.heddles; b++){
            colorArray[a][b] = {
              color: horColor
            }
          }
        }
      }
    this.colorArray = colorArray;
  }

  public draw(){
    let canvas=<HTMLCanvasElement>document.getElementById("nwCanvas");
    // document.getElementById("nwCanvas").setAttribute("style", "color:red; border: 1px solid blue;");
    canvas.width = this.heddles * this.rectSize;
    canvas.height = this.lines * this.rectSize;
    let ctx = canvas.getContext("2d");
    // initCanvas temp solution, should refactor all to one function
    this.initCanvas();
    this.prepareColorArray();
    this.prepareArray();
    this.drawRects(0, 0, this.heddles, this.lines, this.verColor, ctx);
  }

  public nwCanvasListener(evt){
    let canvas= evt.srcElement;
    let ctx = canvas.getContext("2d");
    let x = Math.floor(evt.offsetX / this.rectSize) * 10;
    let y = Math.floor(evt.offsetY / this.rectSize) * 10;
    let xLocation = Math.floor(evt.offsetX / this.rectSize) * this.rectSize;
    let yLocation = Math.floor(evt.offsetY / this.rectSize) * this.rectSize;
    let cHor = ColorOrientation.hor;
    let cVer = ColorOrientation.ver;
    if(this.array[y/10][x/10]){
      ctx.fillStyle = this.colorArray[cVer][y/10].color;
      ctx.fillRect(xLocation,yLocation, this.rectSize, this.rectSize);
      ctx.strokeRect(xLocation,yLocation, this.rectSize, this.rectSize)
      this.array[y/10][x/10] = 0;
    }
    else{
      ctx.fillStyle = this.colorArray[cHor][x/10].color;
      ctx.fillRect(xLocation, yLocation, this.rectSize, this.rectSize);
      ctx.strokeRect(xLocation,yLocation, this.rectSize, this.rectSize)
      this.array[y/10][x/10] = 1;
    }
  }

  public drawne(){
      let canvas=<HTMLCanvasElement>document.getElementById("neCanvas");
      let ctx = canvas.getContext("2d");
      ctx.canvas.width = this.shaft * this.rectSize;
      ctx.canvas.height = this.lines * this.rectSize;
      this.initCanvas();
      this.drawRects(0,0,this.shaft,this.lines, this.defaultWhite, ctx)
  }

  public drawsw(){
      let canvas=<HTMLCanvasElement>document.getElementById("swCanvas");
      let ctx = canvas.getContext("2d");
      ctx.canvas.width = this.heddles * this.rectSize;
      ctx.canvas.height = this.shaft * this.rectSize;
      this.initCanvas();
      this.drawRects(0,0,this.heddles,this.shaft, this.defaultWhite, ctx)
  }
  public drawse(){
      let canvas=<HTMLCanvasElement>document.getElementById("seCanvas");
      let ctx = canvas.getContext("2d");
      ctx.canvas.height = this.shaft * this.rectSize;
      ctx.canvas.width = this.shaft * this.rectSize;
      this.initCanvas();
      this.drawRects(0,0,this.shaft,this.shaft, this.defaultWhite, ctx)
  }

  public drawVerColor(){
      let canvas=<HTMLCanvasElement>document.getElementById("verColorCanvas");
      let ctx = canvas.getContext("2d");
      ctx.canvas.height = this.lines * this.rectSize;
      ctx.canvas.width = this.rectSize;
      this.initCanvas();
      this.drawRects(0,0,1,this.lines, this.verColor, ctx)
  }

  public drawHorColor(){
      let canvas=<HTMLCanvasElement>document.getElementById("horColorCanvas");
      let ctx = canvas.getContext("2d");
      ctx.canvas.height = this.rectSize;
      ctx.canvas.width = this.heddles * this.rectSize;
      this.initCanvas();
      this.drawRects(0,0,this.heddles,1, this.horColor, ctx);
  }

  public colorBarListener(evt, isHor: boolean){
    let x = Math.floor(evt.offsetX / this.rectSize) * 10;
    let y = Math.floor(evt.offsetY / this.rectSize) * 10;
    let xLocation = Math.floor(evt.offsetX / this.rectSize) * this.rectSize;
    let yLocation = Math.floor(evt.offsetY / this.rectSize) * this.rectSize;
    let indexX = x / 10; 
    let indexY = y / 10;
    let cHor = ColorOrientation.hor;
    let cVer = ColorOrientation.ver;
    let canvas = evt.srcElement;
    let ctx = canvas.getContext("2d");
    // orient true = hor false = ver
    if (isHor){
      ctx.fillStyle = this.horColor;
      this.colorArray[cHor][indexX].color = this.horColor;
      ctx.fillRect(xLocation, 0, this.rectSize, this.rectSize);
      ctx.strokeRect(xLocation, 0, this.rectSize, this.rectSize);
    }
    else {
      ctx.fillStyle = this.verColor;
      this.colorArray[cVer][indexY].color = this.verColor;
      ctx.fillRect(0, yLocation, this.rectSize, this.rectSize);
      ctx.strokeRect(0, yLocation, this.rectSize, this.rectSize);
    }
    this.updateColors(xLocation, yLocation, indexX,indexY, isHor)
  }

  public updateColors(x: number, y: number, indexX: number, indexY:number, isHor: boolean){
    let canvas=<HTMLCanvasElement>document.getElementById("nwCanvas");
    let ctx = canvas.getContext("2d");
    let size: number = this.rectSize;
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

  public execute(){
    this.draw();
    this.drawne();
    this.drawse();
    this.drawsw();
    this.drawHorColor();
    this.drawVerColor();
    this.executeClicked = true
  }

  ngOnInit() {
    this.initCanvas();
  }

}
