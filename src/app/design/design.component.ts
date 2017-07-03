import { Component, OnInit } from '@angular/core';
import * as Konva from 'konva';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css']
})
export class DesignComponent implements OnInit {


  constructor() { }

  public draw2(): void {
    // first we need to create a stage
    var stage = new Konva.Stage({
      container: 'container',   // id of container <div>
      width: 580,
      height: 580
    });
    var layer = new Konva.Layer();
    var layer2 = new Konva.Layer();
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j<9;j++){
          var yline = new Konva.Line({
            points: [10 , 70*j + 10, 560 + 10, 70*j + 10],
            stroke: 'red',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
          });
          var xline = new Konva.Line({
            points: [70*i + 10 , 10, 70*i + 10, 560 + 10],
            stroke: 'red',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
          });
          layer2.add(xline)
                .add(yline);
          for (var a = 0; a < 8; a++) {
            for (var b = 0; b < 8; b++) {
              var rect = new Konva.Rect({
                  x: b * 70 + 10,
                  y: a * 70 + 10,
                  width: 70,
                  height: 70,
                  fill: 'green',
                  strokeWidth: 1
              });
              layer.add(rect);
            }
          }

      }
    }
    // add the layer to the stage
    stage.add(layer)
         .add(layer2);
    layer2.moveToTop();
    layer.moveToBottom();
  }

  ngOnInit() {
    this.draw2();
  }

}
