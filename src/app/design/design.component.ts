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
  private crossLayer: Konva.Layer;
  private rectLayer: Konva.Layer;
  private stage: Konva.Stage;

  constructor(
    private globals: MyGlobalsService
  ) {
    this.rectArr = [];
    this.crossLayer = new Konva.Layer();
    this.rectLayer = new Konva.Layer();
  }

  public draw2(): void {
    this.stage = new Konva.Stage({
      container: 'container',   // id of container <div>
      width: this.globals.getCanvasWidth(),
      height: this.globals.getCanvasHeight()
    });
    this.makeCross();
    this.makeRects();
    this.stage.add(this.crossLayer)
              .add(this.rectLayer);
    this.crossLayer.moveToTop();
    this.rectLayer.moveToBottom();
  }
  private makeRects():void {
    let rectLayer = this.rectLayer;
    let stage = this.stage;
    let rectArr = this.rectArr;
    let heddles = this.globals.getHeddles();
    let lines = this.globals.getLines();
    let rectSize = this.globals.getRectSize();
    let padding = this.globals.getPadding();
    for (let a = 0; a < heddles; a++) {
      for (let b = 0; b < lines; b++) {
        let rect = new Konva.Rect({
            x: b * rectSize + padding,
            y: a * rectSize + padding,
            width: rectSize,
            height: rectSize,
            fill: 'white',
            strokeWidth: 1
        });
        let bool = false;
        rect.on('click', function() {
          if (rectArr[rect.getZIndex()].bool === false){
            rectArr[rect.getZIndex()].bool = true
            this.setFill('black');
          }else {
            rectArr[rect.getZIndex()].bool = false;
            this.setFill('white');
          }
          rectLayer.draw();
          console.log(rectArr[rect.getZIndex()].bool)
        console.log(rect.getZIndex())
        });
        rectArr.push({
          bool,
          rect
        })
        rectLayer.add(rect);
      }
    }
  }

  private makeCross():void {
    let tempLayer = this.crossLayer;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j<9;j++){
          let yline = new Konva.Line({
            points: [10 , 70*j + 10, 560 + 10, 70*j + 10],
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
          });
          let xline = new Konva.Line({
            points: [70*i + 10 , 10, 70*i + 10, 560 + 10],
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
          });
          tempLayer.add(xline)
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
