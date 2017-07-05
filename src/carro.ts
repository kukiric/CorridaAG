import {Network, Layer, Neuron} from "synaptic";
import * as Matter from "matter-js";
import * as _ from "lodash";
import Tela from "./tela";

export default class Carro {

    private obj: Matter.Body;

    public nomeSprite: string;
    public forcaEsquerda: number;
    public forcaDireita: number;
    public forcaFreio: number;

    constructor(x: number, y: number) {
        this.obj = Matter.Bodies.rectangle(x, y, 14, 24);
        // Colide somente com as paredes (último bit)
        this.obj.collisionFilter.mask = 0b0001;
        // Categoria dos carros (penúltimo bit)
        this.obj.collisionFilter.category = 0b0010;
        this.nomeSprite = _.sample(Object.keys(Tela.sprites));
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
        Matter.Body.setAngularVelocity(this.obj, 0.1);
    }
}
