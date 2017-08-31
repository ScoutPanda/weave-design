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

  public makeDesignArray(uniqueArray: any[]): any{
    let array = Array(uniqueArray.length);
    return uniqueArray.reduce(function(values, v, i) {
      if(v !== 0){
        if(values.set[v]){
          let len = Object.keys(values.set).length
          for(let j = 0; j <= len; j++){
            if(values.set[v] === j){
              values.array[i] = values.set[v]
            }
          }
        }
        else if (!values.set[v]) {
          values.count++;
          values.array[i] = values.count;
          values.set[v] = values.count;
        }
      }else{
        values.array[i] = 0;
      }
      values.i++
      return values;
    }, { set: {}, count: 0, array});
  }
}