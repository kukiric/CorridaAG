export class Pista {

    public matriz: number[][];
    public largura: number;
    public altura: number;
    public max: number;

    constructor(matriz: number[][], max: number) {
        this.matriz = matriz;
        this.altura = matriz.length;
        this.largura = matriz[0].length;
        this.max = max;
    }
}
