import { Component, OnInit } from '@angular/core';
import * as Konva from 'konva';
import * as SVG from 'svg.js';

import { MyGlobalsService } from '../services/myglobals.service';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css']
})

export class DesignComponent implements OnInit {
  private rectArr: any[];
  private rectLayer: Konva.Layer;
  private verLayer: Konva.Layer;
  private horLayer: Konva.Layer;
  private resultLayer: Konva.Layer;
  private stage: Konva.Stage;

  array: any[];

  constructor(
    private globals: MyGlobalsService
  ) {
    this.rectArr = [];
    this.rectLayer = new Konva.Layer();
    this.horLayer = new Konva.Layer();
    this.verLayer = new Konva.Layer();
    this.resultLayer = new Konva.Layer();
    this.array = [];
  }

  public draw(){
    let canvas=<HTMLCanvasElement>document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    ctx.translate(0.5,0.5)
    this.drawRects(0,0,10,10,ctx);
    let array = this.array
    document.getElementById("myCanvas").addEventListener('click',function(evt){
      console.log(evt.offsetX)
      console.log(evt.offsetY)
      let x = Math.floor(evt.offsetX / 10) * 10;
      let y = Math.floor(evt.offsetY / 10) * 10;
      if(array[x/10][y/10].bool){
        console.log("hello")
        ctx.fillStyle = "#4250f4";
        ctx.fillRect(x,y, 10, 10);
        ctx.strokeStyle = "#5b5b5b5";
        ctx.strokeRect(x,y, 10, 10)
        array[x/10][y/10].bool = false;
      }
      else{
        ctx.fillStyle = "#fff";
        ctx.fillRect(x,y, 10, 10);
        ctx.strokeStyle = "#5b5b5b5";
        ctx.strokeRect(x,y, 10, 10)
        array[x/10][y/10].bool = true;
      }
    },)
  }

  public changeColor(){

  }

  public drawRects(x: number, y: number, width: number, height: number, targetCtx: CanvasRenderingContext2D){
    //x += 0.5;
    //y += 0.5;
    let size: number = this.globals.getRectSize();
    let array: any = this.array;
    let bool: boolean = false;
    for (let a = 0; a < height; a++) {
      array[a] = [];
      for (let b = 0; b < width; b++) {
        targetCtx.fillStyle = "#666666";
        targetCtx.fillRect(b * size + x, a * size + y, size, size);
        targetCtx.strokeStyle = "#5b5b5b5";
        targetCtx.strokeRect(b * size + x, a * size + y, size, size);
        array[a][b] = {bool};
      }
    }console.log(array)
  }

  public draw3() {
    let draw = SVG('container').size(this.globals.getWeaveHeight(), this.globals.getWeaveWidth());
    let rect: any;
    let rectArr = this.rectArr;
    let bool = false;
    for (let a = 0; a < 30; a++) {
      for (let b = 0; b < 30; b++) {
        rect = draw.rect(10, 10).attr({x: a*10, y: b*10,fill:'#f06', stroke: 'gray', 'stroke-width':1})
        rect.click(function() {
          this.fill({color: 'abb'})
        })
        rectArr.push({
          bool,
          rect
        })
      }
    }
    console.log(draw)
  }

  public draw2(): void {
    this.stage = new Konva.Stage({
      container: 'container',   // id of container <div>
      width: this.globals.getAbsoluteWidth(),
      height: this.globals.getAbsoluteHeight()
    });
    this.makeRects();
    this.makeHor();
    this.makeVer();
    this.makeResult();
    this.stage.add(this.rectLayer)
              .add(this.horLayer)
              .add(this.verLayer)
              .add(this.resultLayer);
  }

  private makeResult(){
    let layer = this.resultLayer;
    let heddles = this.globals.getHeddles();
    let lines = this.globals.getLines();
    let size = this.globals.getRectSize();
    let shaft = this.globals.getShaft();
    let padding = this.globals.getPadding();
    let weaveHeight = this.globals.getWeaveHeight();
    let absoluteHeight = this.globals.getAbsoluteHeight();
    let weaveWidth = this.globals.getWeaveWidth();
    let absoluteWidth = this.globals.getAbsoluteWidth();
    let rect = new Konva.Rect({
        width: size,
        height: size,
        fill: 'red',
        stroke: 'grey',
        strokeWidth: 2
    });
    let clone;
    for (let a = 0; a < shaft; a++) {
      for (let b = 0; b < shaft; b++) {
            clone = rect.clone({
            x: (heddles + b) * size + padding * 2,
            y: (lines + a) * size + padding * 2
        });
        layer.add(clone);
      }
    }
  }

  private makeVer() {
    let layer = this.resultLayer;
    let heddles = this.globals.getHeddles();
    let lines = this.globals.getLines();
    let size = this.globals.getRectSize();
    let shaft = this.globals.getShaft();
    let padding = this.globals.getPadding();
    let weaveHeight = this.globals.getWeaveHeight();
    let absoluteHeight = this.globals.getWeaveHeight();
    let weaveWidth = this.globals.getWeaveWidth();
    let absoluteWidth = this.globals.getAbsoluteWidth();
    for (let a = 0; a < lines; a++) {
      for (let b = 0; b < shaft; b++) {
        let rect = new Konva.Rect({
            x: (heddles + b) * size + padding * 2,
            y: a * size + padding,
            width: size,
            height: size,
            fill: 'red',
            stroke: 'grey',
            strokeWidth: 2
        });
        layer.add(rect);
      }
    }
  }

  private makeHor() {
    let layer = this.resultLayer;
    let heddles = this.globals.getHeddles();
    let lines = this.globals.getLines();
    let size = this.globals.getRectSize();
    let shaft = this.globals.getShaft();
    let padding = this.globals.getPadding();
    let weaveHeight = this.globals.getWeaveHeight();
    let absoluteHeight = this.globals.getAbsoluteHeight();
    let weaveWidth = this.globals.getWeaveWidth();
    let absoluteWidth = this.globals.getAbsoluteWidth();
    for (let a = 0; a < shaft; a++) {
      for (let b = 0; b < heddles; b++) {
        let rect = new Konva.Rect({
            x: b * size + padding,
            y: (a + lines) * size + padding * 2,
            width: size,
            height: size,
            fill: 'red',
            stroke: 'grey',
            strokeWidth: 2
        });
        layer.add(rect);
      }
    }
  }

  private makeRects():void {
    let stage = this.stage;
    let rectArr = this.rectArr;
      let layer = this.resultLayer;
      let heddles = this.globals.getHeddles();
      let lines = this.globals.getLines();
      let size = this.globals.getRectSize();
      let shaft = this.globals.getShaft();
      let padding = this.globals.getPadding();
      let weaveHeight = this.globals.getWeaveHeight();
      let absoluteHeight = this.globals.getWeaveHeight();
      let weaveWidth = this.globals.getWeaveWidth();
      let absoluteWidth = this.globals.getAbsoluteWidth();
    for (let a = 0; a < lines; a++) {
      for (let b = 0; b < heddles; b++) {
        let rect = new Konva.Rect({
            x: b * size + padding,
            y: a * size + padding,
            width: size,
            height: size,
            fill: 'red',
            stroke: 'grey',
            strokeWidth: 2
        });
        let bool = false;
        rect.on('click', function() {
          if (rectArr[rect.getZIndex()].bool === false){
            rectArr[rect.getZIndex()].bool = true
            this.setFill('black');
          }else {
            rectArr[rect.getZIndex()].bool = false;
            this.setFill('red');
          }
          rect.draw();
        });
        rectArr.push({
          bool,
          rect
        })
        layer.add(rect);
      }
    }
  }

  public execute(){
    console.time('draw')
    this.rectArr = [];
    this.resultLayer.destroyChildren();
    this.horLayer.destroyChildren();
    this.verLayer.destroyChildren();
    this.rectLayer.destroyChildren();
    this.draw2();
    console.timeEnd('draw')
  }

  ngOnInit() {
    this.draw();
  }

}
