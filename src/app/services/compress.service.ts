import { Injectable } from '@angular/core';

@Injectable()
export class CompressService {
  constructor() { }

  
  public getMaxFromCompressedHorArray(array: number[]): number{
    let len = array.length;
    let horMax = 0;
    for(let i = 0; i < len; i++){
      if(horMax < array[i]){
        horMax = array[i];
      }
    }
    return horMax;
  }

  public getMaxFromCompressedVerArray(array: number[]): number{
    let len = array.length;
    let verMax = 0;
    for(let i = 0; i < len; i++){
      if(verMax < array[i]){
        verMax = array[i];
      }
    }
    return verMax;
  }

  public prepareArray(size: number): number[]{
    let array = Array(size)
    for (let i = 0; i < size; i++){
      array[i] = 0;
    }
    return array;
  }
  
  public prepare2DArray(height: number, width: number): number[]{
    let array = Array(height);
    for (let a = 0; a < height; a++){
      array[a] = Array(width);
      for (let b = 0; b < width; b++){
        array[a][b] = 0;
      }
    }
    return array;
  }

  public prepareColorArray(length: number, color: string): string[]{
    let colorArray = Array(length);
    for (let i = 0; i < length; i++){
      colorArray[i] = color;
    }
    return colorArray;
  }

  public makeCompressedArrayFromUniqueArray(uniqueArray: any[]): any{
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
    }, { set, count, mappedVerColors, mappedHorColors, colorDataMap});
    if(data.mappedVerColors === null){
      return this.compressColorData(null, targetArray2, Array(), colorDataMap, data.set, data.mappedHorColors, data.count);
    }
    else
    {
      return data;
    }
  }

  public decompressColorData(mappedHorColors: number[], mappedVerColors: number[], colorDataMap: string[]){
    let len = mappedHorColors.length;
    let len2 = mappedVerColors.length;
    let horColorArray = Array(len);
    let verColorArray = Array(len2);
    for(let i = 0; i < len; i++){
      horColorArray[i] = colorDataMap[mappedHorColors[i]];
    }
    for(let i = 0; i < len2; i++){
      verColorArray[i] = colorDataMap[mappedVerColors[i]];
    }
    return {verColorArray, horColorArray};
  }

  public compressVerCanvasArray(array: any[], retArray: number[]): number[]{
    let height = array.length;
    let width = array[0].length;
    //let retArray = this.prepareArray(height);
    for(let i = 0; i < height; i++){
      for(let j = 0; j < width; j++){
        if(array[i][j]){
          retArray[i] = j + 1;
        }
      }
    }
    return retArray;
  }

  public compressHorCanvasArray(array: any[], retArray: number[]): number[]{
    let height = array.length;
    let width = array[0].length;
    //let retArray = this.prepareArray(width);
    for(let i = 0; i < height; i++){
      for(let j = 0; j < width; j++){
        if(array[i][j]){
          retArray[j] = i + 1;
        }
      }
    }
    return retArray;
  }

  public decompressVerCanvasArray(verArray: number[], verCanvasArray: number[]): number[]{
    let height = verArray.length;
    let verMax = verCanvasArray.length;
    for(let i = 0; i < height; i++){
      if(verArray[i] <= verMax && verArray[i] > 0){
        verCanvasArray[i][verArray[i]-1] = 1;
      }
    }
    return verCanvasArray;
  }

  public decompressHorCanvasArray(horArray: number[], horCanvasArray: number[], retHorMax: boolean = false): number[]{
    let width = horArray.length;
    let horMax = 0;
    for(let i = 0; i < width; i++){
      if(horArray[i] > 0){
        horCanvasArray[horArray[i]-1][i] = 1;
        if (horArray[i] > horMax){
          horMax = horArray[i];
        }
      }
    }
    return horCanvasArray;
  }

  public decompressResultCanvasArray(horArray: number[], verArray: number[],
    mainCanvasArray: number[], resultCanvasArray: number[]): number[]{
    let width = horArray.length;
    let height = verArray.length;
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (mainCanvasArray[i][j] == 1) {
          resultCanvasArray[horArray[j]-1][verArray[i]-1] = 1;
        }
      }
    }
    return resultCanvasArray;
  }
}