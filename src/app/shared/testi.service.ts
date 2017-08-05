//import { Injectable } from '@angular/core';
import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({ selector: '[testi]' })
export class TestiService {

  constructor(el: ElementRef, renderer: Renderer2) {
      renderer.setProperty(el.nativeElement, 'innerHTML', 'some new value');
  }

}
