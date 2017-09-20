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
      colorArray[i] = color;
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
      return values;
    }, { set: {}, count: 0, array});
  }

  public compressColorData(targetArray: string[], targetArray2: string[], mappedHorColors: number[] = [],
    colorDataMap: string[] = [], set: object = {}, mappedVerColors: number[] = null, count: number = 0){
    if(targetArray === null){
      targetArray = targetArray2;
    }
    let data = targetArray.reduce(function(values, v) {
      if(values.set.hasOwnProperty(v)){
        let len = colorDataMap.length
        for(let j = 0; j < len; j++){
          if(colorDataMap[j] === v){
            values.mappedHorColors.push(values.set[v]);
          }
        }
      }
      else if (!values.set[v]){
        values.colorDataMap.push(v)
        values.set[v] = values.count;
        values.mappedHorColors.push(values.count);
        values.count++;
      }
      return values;
    }, { set, count, mappedHorColors, mappedVerColors, colorDataMap});
    if(data.mappedVerColors === null){
      return this.compressColorData(null, targetArray2, Array(), colorDataMap, data.set, data.mappedHorColors, data.count);
    }
    else
    {
      return data;
    }
  }

  public compressVerCanvasArray(array: any[]): number[]{
    let height = array.length;
    let width = array[0].length;
    let retArray = this.prepareArray(Array(height), height);
    for(let i = 0; i < height; i++){
      for(let j = 0; j < width; j++){
        if(array[i][j]){
          retArray[i] = j + 1;
        }
      }
    }
    return retArray;
  }

  public compressHorCanvasArray(array: any[]): number[]{
    let height = array.length;
    let width = array[0].length;
    let retArray = this.prepareArray(Array(width), width);
    for(let i = 0; i < height; i++){
      for(let j = 0; j < width; j++){
        if(array[i][j]){
          retArray[j] = i + 1;
        }
      }
    }
    return retArray;
  }
}