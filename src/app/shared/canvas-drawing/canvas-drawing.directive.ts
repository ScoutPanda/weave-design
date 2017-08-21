import { OnInit, Directive, Input, ElementRef, Renderer2 } from '@angular/core';

import { CanvasDrawingComponent } from './canvas-drawing.component';

@Directive({
    selector: '[canvasDrawing]'
})
export class CanvasDrawingDirective implements OnInit {
  @Input() isDesign: boolean;
  @Input() eventListener: any;

  constructor(private renderer2: Renderer2, private el: ElementRef){}

  ngOnInit() {}

  ngAfterViewInit(){
    if (this.isDesign){
      this.renderer2.listen(this.el.nativeElement, 'click', this.eventListener)
    }
  }
}