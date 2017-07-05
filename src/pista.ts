import * as Matter from "matter-js";
import * as _ from "lodash";

export interface ChaoPista extends Matter.Body {
    numero: number;
}

export default class Pista {

    public paredes: Matter.Body[];
    public matriz: number[];
    public colunas: number;
    public linhas: number;
    public max: number;
    public escala: number;

    constructor(matriz: number[], colunas: number, escala: number, mundo: Matter.World) {
        this.matriz = matriz;
        this.linhas = Math.trunc(matriz.length / colunas);
        this.colunas = colunas;
        this.escala = escala;
        this.max = _.max(matriz);
        // Cria os objetos na engine de fisica
        this.paredes = [];
        matriz.forEach((elemento, i) => {
            let pos = this.posRealCentro(i);
            let obj: Matter.Body;
            // Parede (com colisão)
            if (elemento == 0) {
                obj = Matter.Bodies.rectangle(pos.x, pos.y, this.escala, this.escala, {
                    isStatic: true,
                    label: "Parede"
                });
                this.paredes.push(obj);
            }
            // Chão (somente trigger)
            else {
                obj = Matter.Bodies.rectangle(pos.x, pos.y, this.escala, this.escala, {
                    isStatic: true,
                    isSensor: true,
                    label: "Chão"
                });
                (obj as ChaoPista).numero = elemento;
            }
            Matter.World.addBody(mundo, obj);
        });
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
