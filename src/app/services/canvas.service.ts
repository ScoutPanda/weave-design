import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';

import { CanvasModel } from './canvas.model';

@Injectable()
export class CanvasService {
  private canvases: CanvasModel[] = [];

  constructor(private http: Http) { }

  public addCanvas(canvas: CanvasModel){
    const body = JSON.stringify(canvas);
    const headers = new Headers({'Content-Type': 'application/json'});
    const token = localStorage.getItem('id_token')
      ? '?token=' + localStorage.getItem('id_token')
      : '';
    return this.http.post('/api/canvas' + token, body, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public getCanvases(){
    const token = localStorage.getItem('id_token')
      ? '?token=' + localStorage.getItem('id_token')
      : '';
    return this.http.get('/api/canvas' + token)
      .map((response: Response) => {
        const canvases = response.json().obj
        let transformedCanvases: CanvasModel[] = [];
        for (let canvas of canvases){
          transformedCanvases.push(new CanvasModel(canvas.canvasName, canvas.canvasData, canvas._id, canvas.authUserId))
        }
        this.canvases = transformedCanvases;
        return transformedCanvases;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public updateCanvas(canvas: CanvasModel){
    const body = JSON.stringify(canvas);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.patch('/api/canvas/' + canvas.canvasId, body, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public removeCanvas(canvas: CanvasModel){
    this.canvases.splice(this.canvases.indexOf(canvas), 1);
    return this.http.delete('/api/canvas/' + canvas.canvasId)
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

}
