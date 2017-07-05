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

  constructor(
    private globals: MyGlobalsService
  ) {
    this.rectArr = [];
    this.rectLayer = new Konva.Layer();
    this.horLayer = new Konva.Layer();
    this.verLayer = new Konva.Layer();
    this.resultLayer = new Konva.Layer();
  }

  public draw2(): void {
    this.stage = new Konva.Stage({
      container: 'container',   // id of container <div>
      width: this.globals.getAbsoluteWidth(),
      height: this.globals.getAbsoluteHeight()
    });
    this.makeRects();
    this.makeCross();
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
    for (let a = 0; a < shaft; a++) {
      for (let b = 0; b < shaft; b++) {
        let rect = new Konva.Rect({
            x: (heddles + b) * size + padding * 2 +1,
            y: (lines + a) * size + padding * 2 +1,
            width: size -2,
            height: size -2,
            fill: 'red',
            strokeWidth: 1
        });
        layer.add(rect);
      }
    }
    for (let i = 0; i < shaft + 1; i++) {
      for (let j = 0; j< shaft + 1;j++){
          let yline = new Konva.Line({
            points: [size* (i+heddles) + 20 , weaveHeight + 20, size *(i+heddles) + 20, absoluteHeight - 10],
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
            listening: false
          });
          let xline = new Konva.Line({
            points: [absoluteWidth - 10 , size * (j + lines) + 20, weaveWidth + 20, size * (j + lines) + 20],
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
            listening: false
          });
          layer.add(xline)
               .add(yline);
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
            x: (heddles + b) * size + padding * 2 +1,
            y: a * size + padding +1,
            width: size -2,
            height: size -2,
            fill: 'red',
            strokeWidth: 1
        });
        layer.add(rect);
      }
    }
    for (let i = 0; i < shaft + 1; i++) {
      for (let j = 0; j< lines + 1;j++){
          let yline = new Konva.Line({
            points: [size * (i+ heddles) + 20 , 10, size *(i+heddles) + 20, weaveHeight + 10],
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
            listening: false
          });
          let xline = new Konva.Line({
            points: [absoluteWidth - 10 , size*j + 10, weaveWidth + 20, size *j + 10],
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
            listening: false
          });
          layer.add(xline)
               .add(yline);
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
            x: b * size + padding + 1,
            y: (a + lines) * size + padding * 2 +1,
            width: size -2,
            height: size -2,
            fill: 'red',
            strokeWidth: 1
        });
        layer.add(rect);
      }
    }
    for (let i = 0; i < heddles + 1; i++) {
      for (let j = 0; j< shaft + 1;j++){
          let yline = new Konva.Line({
            points: [size * i + 10 , weaveHeight + 20, size*i + 10, absoluteHeight - 10],
            stroke: 'grey',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
            listening: false
          });
          let xline = new Konva.Line({
            points: [10, size*(j+lines) + 20, weaveWidth + 10, size*(j + lines) + 20],
            stroke: 'grey',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
            listening: false
          });
          layer.add(xline)
               .add(yline);
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
            x: b * size + padding +1,
            y: a * size + padding +1,
            width: size -2,
            height: size -2,
            fill: 'red',
            strokeWidth: 1
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

  private makeCross():void {
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
    for (let i = 0; i < this.globals.getHeddles() + 1; i++) {
      for (let j = 0; j<this.globals.getLines() + 1; j++){
          let yline = new Konva.Line({
            points: [size*i + 10 , 10, size*i + 10, weaveHeight + 10],
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
            listening: false
          });
          let xline = new Konva.Line({
            points: [10 , size*j + 10, weaveWidth + 10, size *j + 10],
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
            listening: false
          });
          layer.add(xline)
                   .add(yline);
      }
    }
  }

  public execute(){

    console.log(this.rectArr)
    console.log("lol");
  }

  ngOnInit() {
    this.draw2();
  }

}
