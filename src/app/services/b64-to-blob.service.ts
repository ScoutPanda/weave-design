import { Injectable } from '@angular/core';

@Injectable()
export class B64ToBlobService {
  constructor() { }

  public ToBlob(b64Data, sliceSize = 512) {
    var arr = b64Data.split(',');
    b64Data = atob(arr[1]);
    var mime = arr[0].split(':')[1].split(';')[0];
    var byteCharacters = atob(arr[1]);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      var byteArray = new Uint8Array(byteNumbers);
  
      byteArrays.push(byteArray);
    }
  
    var blob = new Blob(byteArrays, {type: mime});
    return blob;
  }

}