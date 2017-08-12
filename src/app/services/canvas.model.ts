import {CanvasDataModel } from './canvasdata.model';

export class CanvasModel {
    constructor(
        public canvasName: string,
        public canvasData: string,
        public canvasId?: string,
        public userId?: string
    ){}
}