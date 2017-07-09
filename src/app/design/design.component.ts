import { Component, OnInit } from '@angular/core';
import * as Konva from 'konva';

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

  private array: any[];

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
  public prepareArray(){
      let array: any = Array(1000);
      for (let a = 0; a < 1000; a++) {
        array[a] = Array(1000);
        for (let b = 0; b < 1000; b++) {
          array[a][b] = 0;
        }
      }
      this.array = array;
  }

  public draw(){
  console.time("koira")
    //window.document.getElementById("canvasContainer").innerHTML = ;
    let canvas=<HTMLCanvasElement>document.getElementById("nwCanvas");
    //document.getElementById("nwCanvas").setAttribute("style", "color:red; border: 1px solid blue;");
    let ctx = canvas.getContext("2d");
    ctx.translate(1,1)
    ctx.lineWidth=2;
    //this.prepareArray();
    this.drawRects(0,0,1000,1000,ctx);
    let array = this.array
    document.getElementById("nwCanvas").addEventListener('click',function(evt){
        console.time("koira");
      //if (evt.offsetY >= 0 && evt.offsetY <= 100 && evt.offsetX >= 0 && evt.offsetX <= 100){
          let x = Math.floor(evt.offsetX / 10) * 10;
          let y = Math.floor(evt.offsetY / 10) * 10;
          if(array[x/10][y/10]){
            ctx.fillStyle = "#4250f4";
            ctx.fillRect(x,y, 10, 10);
            ctx.strokeStyle = "#5b5b5b5";
            ctx.strokeRect(x,y, 10, 10)
            array[x/10][y/10] = 0;
          }
          else{
            ctx.fillStyle = "#fff";
            ctx.fillRect(x,y, 10, 10);
            ctx.strokeStyle = "#5b5b5b5";
            ctx.strokeRect(x,y, 10, 10)
            array[x/10][y/10] = 1;
          }
      //}
      console.timeEnd("koira");
  },)
  console.timeEnd("koira")
  }

  public drawne(){
      let canvas=<HTMLCanvasElement>document.getElementById("neCanvas");
      let ctx = canvas.getContext("2d");
      ctx.translate(1,1);
      ctx.lineWidth=2;
      this.drawRects(0,0,2,10,ctx)
  }

  public drawsw(){
      let canvas=<HTMLCanvasElement>document.getElementById("swCanvas");
      let ctx = canvas.getContext("2d");
      ctx.translate(1,1);
      ctx.lineWidth=2;
      this.drawRects(0,0,10,2,ctx)
  }
  public drawse(){
      let canvas=<HTMLCanvasElement>document.getElementById("seCanvas");
      let ctx = canvas.getContext("2d");
      ctx.translate(1,1);
      ctx.lineWidth=2;
      this.drawRects(0,0,2,2,ctx)
  }

  public changeColor(){

  }

  public drawRects(x: number, y: number, width: number, height: number, targetCtx: CanvasRenderingContext2D){
    //x += 0.5;
    //y += 0.5;
    let size: number = this.globals.getRectSize();
    let array: any = this.array;
    for (let a = 0; a < height; a++) {
      array[a] = [];
      for (let b = 0; b < width; b++) {
        targetCtx.fillStyle = "#666666";
        targetCtx.fillRect(b * size + x, a * size + y, size, size);
        targetCtx.strokeStyle = "#5b5b5b5";
        targetCtx.strokeRect(b * size + x, a * size + y, size, size);
        array[a][b] = 0;
      }
    }
  }

  /*public draw3() {
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
}*/

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
    this.draw();
    this.drawne();
    this.drawse();
    this.drawsw();
  }

  ngOnInit() {
  }

}
