import * as Synaptic from "synaptic";
import * as Matter from "matter-js";
import * as _ from "lodash";
import Tela from "./tela";
import AG from "./ag";

export default class Carro {

    private obj: Matter.Body;
    private net: Synaptic.Network;
    public nomeSprite: string;

    constructor(x: number, y: number, rede?: Synaptic.Network) {
        this.obj = Matter.Bodies.rectangle(x, y, 14, 24);
        // Colide somente com as paredes (último bit)
        this.obj.collisionFilter.mask = 0b0001;
        // Categoria dos carros (penúltimo bit)
        this.obj.collisionFilter.category = 0b0010;
        this.nomeSprite = _.sample(Object.keys(Tela.sprites));
        if (rede == undefined) {
            rede = AG.criarIndividuo();
        }
        this.net = rede;
    }

    // Lê a rede do JSON e aplica ela
    public setRedeNeural(rede: any) {
        this.net = Synaptic.Network.fromJSON(rede);
    }

    // Extrai a rede neural para um JSON
    public getRedeNeural() {
        return this.net.toJSON();
    }

    // Adiciona o carro na engine de física
    public registrar(mundo: Matter.World) {
        Matter.World.addBody(mundo, this.obj);
    }

    // Remove as referências desse carro da engine de física
    public remover(mundo: Matter.World) {
        Matter.World.remove(mundo, this.obj);
    }

    public getTransform() {
        return {
            position: this.obj.position,
            angle: this.obj.angle
        };
    }

    public update() {
        let forcaAceleracao = {x: 0, y: -2};
        let forcaDirecionada = Matter.Vector.rotate(forcaAceleracao, this.obj.angle);
        Matter.Body.setVelocity(this.obj, forcaDirecionada);
        // Aplica a rede neural
        let saidas = this.net.activate([0]);
        let forcaEsquerda = saidas[0];
        let forcaDireita = saidas[1];
        let direcao = forcaDireita - forcaEsquerda;
        Matter.Body.setAngularVelocity(this.obj, 0.1 * direcao);
    }
}
