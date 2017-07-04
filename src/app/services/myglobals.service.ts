import { Injectable } from '@angular/core';

@Injectable()
export class MyGlobalsService {
  private rectSize;
  private canvasWidth;
  private canvasHeight;
  private heddles;
  private lines;
  private padding;

  constructor() {
    this.rectSize = 70;
    this.canvasWidth = 560;
    this. canvasHeight = 560;
    this.heddles = 8;
    this.lines = 8;
    this.padding = 10;
  }

  getRectSize(){
    return this.rectSize;
  }
  getCanvasWidth(){
    return this.canvasWidth;
  }
  getCanvasHeight(){
    return this.canvasHeight;
  }
  getHeddles(){
    return this.heddles;
  }
  getLines(){
    return this.lines;
  }
  getPadding(){
    return this.padding;
  }
}
