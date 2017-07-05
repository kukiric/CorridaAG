import * as Synaptic from "synaptic";
import * as _ from "lodash";

export interface NeuronioJSON {
    activation: number,
    bias: number,
    layer: string | number,
    squash: string
}

export interface ConexaoJSON {
    from: number,
    to: number,
    weight: number
}

export interface RedeJSON {
    connections: ConexaoJSON[],
    neurons: NeuronioJSON[]
}

export default class Cromossomo {

    public redeJson: RedeJSON;
    public fitness: number;

    // Cria um novo individũo sem aprendizado
    public static aleatorio() {
        let novo = new Cromossomo();
        novo.redeJson = new Synaptic.Architect.Perceptron(9, 12, 2).toJSON();
        return novo;
    }

    // Modifica uma conexão aleatória
    public mutar() {
        _.sample(this.redeJson.connections).weight = Math.random() * 2 - 1;
    }

    // Cruza dois indivíduos
    public cruzar(outro: Cromossomo) {
        // Divide metade dos pesos das conexões de cada indivídeuo
        let meio = Math.trunc(this.redeJson.connections.length / 2);
        return this.redeJson.connections.slice(0, meio).concat(this.redeJson.connections.slice(meio));
    }
}
