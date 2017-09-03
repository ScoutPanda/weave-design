import { Injectable} from '@angular/core';

@Injectable()
export class SharedDataService {
  constructor() {}
  public mainCanvasArray: any[] = [];
  public resultCanvasArray: any[] = [];
  public verCanvasArray: any[] = [];
  public horCanvasArray: any[] = [];
  public horColorArray: any[] = [];
  public verColorArray: any[] = [];
  public canvasArray;
  public horMax: number = 2;
  public verMax: number = 2;
  public padding: number = 5;

  //private ctxObject = {} as CanvasCtxInterface;

  public heddles: number = 10;
  public lines: number = 10;
  public shaft: number = 2;
  public rectSize: number = 10;

  public horCPArray: any[] = ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'];
  public verCPArray: any[] = ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'];

  public executeClicked: boolean = false;

  public verColor: string = "#fff500";
  public horColor: string = "#F8F8FF";
  public defaultVerColor: string = "#fff500";
  public defaultHorColor: string = "#F8F8FF";
  public defaultWhite: string = "#F8F8FF";
  public defaultGray: string = "#9E9E9E";
  public defaultRectStrokeColor: string = "#616161";
  public defaultLineWidth: number = 2;
  public isAdditionMode: boolean = true;

  public hasInitialData: boolean = false;
}