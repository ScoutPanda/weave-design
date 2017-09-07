export class CanvasDataModel {
    constructor(
        public mappedVerColors: number[],
        public mappedHorColors: number[],
        public colorDataMap: string[],
        public compressedVerCanvas: number[],
        public compressedHorCanvas: number[],
        public resultCanvas: number[]
    ){}
}