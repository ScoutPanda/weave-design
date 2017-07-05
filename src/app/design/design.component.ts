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
    for (let a = 0; a < shaft; a++) {
      for (let b = 0; b < shaft; b++) {
        let rect = new Konva.Rect({
            x: (this.globals.getHeddles() + b) * size + padding * 2,
            y: (this.globals.getLines() + a) * size + padding * 2,
            width: size,
            height: size,
            fill: 'red',
            strokeWidth: 1
        });
        layer.add(rect);
      }
    }
    for (let i = 0; i < shaft + 1; i++) {
      for (let j = 0; j< shaft + 1;j++){
          let yline = new Konva.Line({
            points: [this.globals.getRectSize()* (i+this.globals.getHeddles()) + 20 , this.globals.getWeaveHeight() + 20, this.globals.getRectSize()*(i+this.globals.getHeddles()) + 20, this.globals.getAbsoluteHeight() - 10],
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
          });
          let xline = new Konva.Line({
            points: [this.globals.getAbsoluteWidth() - 10 , this.globals.getRectSize()* (j + this.globals.getLines()) + 20, this.globals.getWeaveWidth() + 20, this.globals.getRectSize()* (j + this.globals.getLines()) + 20],
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
          });
          layer.add(xline)
               .add(yline);
      }
    }
  }

  private makeVer() {
    let layer = this.horLayer;
    let lines = this.globals.getLines();
    let size = this.globals.getRectSize();
    let shaft = this.globals.getShaft();
    let padding = this.globals.getPadding();
    for (let a = 0; a < lines; a++) {
      for (let b = 0; b < shaft; b++) {
        let rect = new Konva.Rect({
            x: (this.globals.getHeddles() + b) * size + padding * 2,
            y: a * size + padding,
            width: size,
            height: size,
            fill: 'red',
            strokeWidth: 1
        });
        layer.add(rect);
      }
    }
    for (let i = 0; i < shaft + 1; i++) {
      for (let j = 0; j< this.globals.getLines() + 1;j++){
          let yline = new Konva.Line({
            points: [this.globals.getRectSize()* (i+this.globals.getHeddles()) + 20 , 10, this.globals.getRectSize()*(i+this.globals.getHeddles()) + 20, this.globals.getWeaveHeight() + 10],
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
          });
          let xline = new Konva.Line({
            points: [this.globals.getAbsoluteWidth() - 10 , this.globals.getRectSize()*j + 10, this.globals.getWeaveWidth() + 20, this.globals.getRectSize()*j + 10],
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
          });
          layer.add(xline)
               .add(yline);
      }
    }
  }

  private makeHor() {
    let layer = this.verLayer;
    let heddles = this.globals.getHeddles();
    let size = this.globals.getRectSize();
    let shaft = this.globals.getShaft();
    let padding = this.globals.getPadding();
    for (let a = 0; a < shaft; a++) {
      for (let b = 0; b < heddles; b++) {
        let rect = new Konva.Rect({
            x: b * size + padding,
            y: (a + this.globals.getLines()) * size + padding * 2,
            width: size,
            height: size,
            fill: 'red',
            strokeWidth: 1
        });
        layer.add(rect);
      }
    }
    for (let i = 0; i < heddles + 1; i++) {
      for (let j = 0; j< shaft + 1;j++){
          let yline = new Konva.Line({

            points: [this.globals.getRectSize()* i + 10 , this.globals.getWeaveHeight() + 20, this.globals.getRectSize()*i + 10, this.globals.getAbsoluteHeight() - 10],
            stroke: 'grey',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
          });
          let xline = new Konva.Line({
            points: [10, this.globals.getRectSize()*(j+this.globals.getLines()) + 20, this.globals.getWeaveWidth() + 10, this.globals.getRectSize()*(j + this.globals.getLines()) + 20],
            stroke: 'grey',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
          });
          layer.add(xline)
               .add(yline);
      }
    }
  }

  private makeRects():void {
    let layer = this.rectLayer;
    let stage = this.stage;
    let rectArr = this.rectArr;
    let heddles = this.globals.getHeddles();
    let lines = this.globals.getLines();
    let rectSize = this.globals.getRectSize();
    let padding = this.globals.getPadding();
    for (let a = 0; a < lines; a++) {
      for (let b = 0; b < heddles; b++) {
        let rect = new Konva.Rect({
            x: b * rectSize + padding,
            y: a * rectSize + padding,
            width: rectSize,
            height: rectSize,
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
          layer.draw();
          console.log(rectArr[rect.getZIndex()].bool)
        console.log(rect.getZIndex())
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
    let layer = this.rectLayer;
    for (let i = 0; i < this.globals.getHeddles() + 1; i++) {
      for (let j = 0; j<this.globals.getLines() + 1; j++){
          let yline = new Konva.Line({
            points: [this.globals.getRectSize()*i + 10 , 10, this.globals.getRectSize()*i + 10, this.globals.getWeaveHeight() + 10],
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
          });
          let xline = new Konva.Line({
            points: [10 , this.globals.getRectSize()*j + 10, this.globals.getWeaveWidth() + 10, this.globals.getRectSize()*j + 10],
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
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
