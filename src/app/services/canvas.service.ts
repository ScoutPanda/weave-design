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
    console.log(body)
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('https://weave-design.herokuapp.com/api/canvas', body, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public getCanvas(){
    return this.http.get('https://weave-design.herokuapp.com/api/canvas')
      .map((response: Response) => {
        const canvases = response.json().obj
        let transformedCanvases: CanvasModel[] = [];
        for (let canvas of canvases){
          console.log(canvas.canvasData)
          transformedCanvases.push(new CanvasModel(canvas.canvasName, canvas.canvasData, canvas.id, 'koira'))
        }
        this.canvases = transformedCanvases;
        console.log(transformedCanvases)
        return transformedCanvases;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

}
