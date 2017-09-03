import { Injectable} from '@angular/core';

import { B64ToBlobService } from './b64-to-blob.service';

@Injectable()
export class SaveToPngService {
  constructor(private b64ToBlob: B64ToBlobService) {}

  public saveToPng(canvasArray: HTMLCanvasElement[], tempCanvas: HTMLCanvasElement, size: number, padding: number,
    heddles: number, lines: number, verMax: number, horMax: number){

    let ctx = tempCanvas.getContext("2d");
    ctx.canvas.width = size * heddles + padding * 2 + size * verMax + size;
    ctx.canvas.height = size * lines + padding * 2 + size * horMax + size;
    //ctx.fillStyle = "#fff";
    //ctx.fillRect(0,0, absolutewidth, absoluteheight)
    //let len = canvases.length - 1;
    //ctx.drawImage(canvases[len],0,0)
    
    // Yes, I know it is horrible
    
    ctx.drawImage(canvasArray[0], 0, 0)
    ctx.drawImage(canvasArray[1], 0, size + padding)
    ctx.drawImage(canvasArray[2], heddles * size + padding, size + padding)
    ctx.drawImage(canvasArray[3], 0, size * horMax + size + padding * 2)
    ctx.drawImage(canvasArray[4], heddles * size + padding, size * horMax + size + padding * 2)
    ctx.drawImage(canvasArray[5], heddles * size + padding * 2 + size * verMax, size * horMax + size + padding * 2)
    var base64 = tempCanvas.toDataURL();
    let blob = this.b64ToBlob.ToBlob(base64);
    return URL.createObjectURL(blob);
  }

}