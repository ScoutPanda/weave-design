import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ColorPickerModule } from 'ngx-color-picker';

import { CanvasDrawingService } from './canvas-drawing.service';
import { CanvasDrawingComponent } from './canvas-drawing.component';
import { CanvasDrawingDirective } from './canvas-drawing.directive';

@NgModule({
  imports: [ 
    CommonModule,
    FormsModule,
    ColorPickerModule,
    ],
  providers: [ CanvasDrawingService ],
  declarations: [ CanvasDrawingComponent, CanvasDrawingDirective ],
  exports: [ CanvasDrawingComponent, CanvasDrawingDirective ],
  //entryComponents: [ CanvasDrawingComponent ]
})
export class CanvasDrawingModule {}