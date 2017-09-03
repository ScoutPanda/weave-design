import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../../app-routing.module';

import { ColorPickerModule } from 'ngx-color-picker';

import { CanvasDrawingService } from './canvas-drawing.service';
import { CanvasDrawingComponent } from './canvas-drawing.component';
import { CanvasDrawingDirective } from './canvas-drawing.directive';
import { SaveToPngService } from '../../services/savetopng.service';

@NgModule({
  imports: [ 
    CommonModule,
    FormsModule,
    ColorPickerModule,
    AppRoutingModule
    ],
  providers: [ CanvasDrawingService, SaveToPngService ],
  declarations: [ CanvasDrawingComponent, CanvasDrawingDirective ],
  exports: [ CanvasDrawingComponent, CanvasDrawingDirective ],
  //entryComponents: [ CanvasDrawingComponent ]
})
export class CanvasDrawingModule {}