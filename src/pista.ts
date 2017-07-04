export class Pista {

    public matriz: number[][];
    public largura: number;
    public altura: number;

    constructor(matriz) {
        this.matriz = matriz;
        this.altura = matriz.length;
        this.largura = matriz[0].length;
    }
}
