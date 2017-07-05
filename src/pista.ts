import {World, Body, Bodies} from "matter-js";
import * as _ from "lodash";

export default class Pista {

    public matriz: number[];
    public colunas: number;
    public linhas: number;
    public max: number;
    public escala: number;

    constructor(matriz: number[], colunas: number, escala: number, mundo: World) {
        this.matriz = matriz;
        this.linhas = Math.trunc(matriz.length / colunas);
        this.colunas = colunas;
        this.escala = escala;
        this.max = _.max(matriz);
    }

    // Converte a posição do vetor para posição [x, y]
    public posReal(pos: number) {
        return {
            x: Math.trunc(pos % this.colunas) * this.escala,
            y: Math.trunc(pos / this.colunas) * this.escala
        };
    }

    // Mesma coias que posReal mas no centro do quadrado
    public posRealCentro(pos: number) {
        let ret = this.posReal(pos);
        ret.x += this.escala / 2;
        ret.y += this.escala / 2;
        return ret;
    }

    // Pega o valor na posição [i, j]
    public matrizAt(i: number, j: number) {
        return this.matriz[i * this.colunas + j];
    }

    // Retorna a posição real (no canvas) que tem o valor 1
    public getPosInicio() {
        return this.posRealCentro(_.findIndex(this.matriz, x => x == 1));
    }
}
