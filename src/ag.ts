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

    private constructor(rede?: RedeJSON) {
        this.redeJson = rede;
    }

    // Cria um novo individũo sem aprendizado
    public static aleatorio() {
        let novo = new Cromossomo();
        novo.redeJson = new Synaptic.Architect.Perceptron(9, 12, 2).toJSON();
        return novo;
    }

    // Modifica uma conexão aleatória
    public causarMutacao() {
        // Duplica a rede antes de alterar ela
        this.redeJson = JSON.parse(JSON.stringify(this.redeJson));
        _.sample(this.redeJson.connections).weight = Math.random() * 2 - 1;
    }

    // Cruza dois indivíduos
    public cruzar(outro: Cromossomo) {
        // Divide metade dos pesos das conexões de cada indivídeuo
        let novo = new Cromossomo(this.redeJson);
        let meio = Math.trunc(this.redeJson.connections.length / 2);
        novo.redeJson.connections = novo.redeJson.connections.map((con, i) => {
            // Duplica a conexão e altera ela
            let nova = JSON.parse(JSON.stringify(con));
            if (i > meio) {
                nova.weight = outro.redeJson.connections[i].weight;
            }
            return con;
        });
        return novo;
    }

    public static vetorChances(individuos: Cromossomo[]) {
        let chances: number[] = [];
        // Preenche o vetor de chances
        individuos.forEach((individuo, id) => {
            for (let i = 0; i < individuo.fitness; i++) {
                chances.push(id);
            }
        });
        return chances;
    }

    // Seleciona dois indivíduos aleatóriso para o cruzamento por roleta
    public static selecao(chances: number[]) {
        let a = 0;
        let b = 0;
        while (a == b) {
            a = _.sample(chances);
            b = _.sample(chances);
        }
        return {
            a: a,
            b: b
        };
    }
}
