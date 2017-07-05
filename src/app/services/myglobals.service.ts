import { Injectable } from '@angular/core';

@Injectable()
export class MyGlobalsService {
  private rectSize;
  private weaveWidth;
  private weaveHeight;
  private absoluteWidth;
  private absoluteHeight;
  private heddles;
  private lines;
  private padding;
  private shaft;

  constructor() {
    this.rectSize = 20;
    this.heddles = 10;
    this.lines = 10;
    this.padding = 10;
    this.shaft = 3;
    this.weaveWidth = this.heddles * this.rectSize;
    this.weaveHeight = this.lines * this.rectSize;
    this.absoluteWidth = this.weaveWidth + 3 * this.padding + this.shaft * this.rectSize;
    this.absoluteHeight = this.weaveHeight + 3 * this.padding + this.shaft * this.rectSize;
  }

  getRectSize(){
    return this.rectSize;
  }
  getWeaveWidth(){
    return this.weaveWidth;
  }
  getWeaveHeight(){
    return this.weaveHeight;
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
  getShaft(){
    return this.shaft;
  }
  getAbsoluteWidth(){
    return this.absoluteWidth;
  }
  getAbsoluteHeight(){
    return this.absoluteHeight;
  }
}
