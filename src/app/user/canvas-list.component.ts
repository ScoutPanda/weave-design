import 'rxjs/add/operator/switchMap';
import { Component, OnInit, Input } from '@angular/core';
import { CanvasService }  from '../services/canvas.service';
import { CanvasModel } from '../services/canvas.model';

@Component({
    selector: 'app-canvas-list',
  template: `
  <h2>CANVASES</h2>
  <ul>
    <li *ngFor="let canvas of canvases">
        <span>{{canvas.canvasName}} {{canvas.canvasId}}</span><button (click)=remove(canvas)>remove</button>
    </li>
    </ul>
  `,
})
export class CanvasListComponent implements OnInit {

  private canvases: CanvasModel[];
  public canvas: CanvasModel;

  constructor(
    private canvasService: CanvasService
  ) {}

  public remove(canvas: CanvasModel){
    this.canvasService.removeCanvas(canvas)
        .subscribe(
            result => console.log(result)
        );
  }

  ngOnInit() {
    this.canvasService.getCanvases()
      .subscribe((
        canvases: CanvasModel[]) => {
          this.canvases = canvases;
        }
      );
  }
}