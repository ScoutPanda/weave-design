import { Injectable } from '@angular/core';

@Injectable()
export class CanvasDrawingService {
  constructor() { }

  public prepareArray(array: any[], size: number): number[]{
    array = Array(size)
    for (let i = 0; i < size; i++){
      array[i] = 0;
    }
    return array;
  }
  
  public prepare2DArray(array: any[], height: number, width: number): number[]{
    array = Array(height);
    for (let a = 0; a < height; a++){
      array[a] = Array(width);
      for (let b = 0; b < width; b++){
        array[a][b] = 0;
      }
    }
    return array;
  }

  public prepareColorArray(colorArray: any[], length: number, color: string): string[]{
    for (let i = 0; i < length; i++){
      colorArray[i] = {
        color: color
      };
    }
    return colorArray;
  }
}