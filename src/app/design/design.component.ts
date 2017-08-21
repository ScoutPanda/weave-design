import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css']
})

export class DesignComponent implements OnInit {
  public shaft: number = 2;
  public heddles: number = 10;
  public lines: number = 10;
  public rectSize: number = 10;

  constructor() {}

  ngOnInit() {}

}
