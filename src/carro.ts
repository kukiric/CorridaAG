import {Network, Layer, Neuron} from "synaptic";
import {World, Body, Bodies} from "matter-js";
import * as _ from "lodash";
import Tela from "./tela";

export default class Carro {

    private body: Body;

    public nomeSprite: string;
    public forcaEsquerda: number;
    public forcaDireita: number;
    public forcaFreio: number;

    constructor(x: number, y: number) {
        this.body = Bodies.rectangle(x, y, 10, 10);
        // Colide somente com as paredes (último bit)
        this.body.collisionFilter.mask = 0b0001;
        // Categoria dos carros (penúltimo bit)
        this.body.collisionFilter.category = 0b0010;
        
        this.nomeSprite = _.sample(Object.keys(Tela.sprites));
    }

    // Adiciona o carro na engine de física
    public registrar(mundo: World) {
        World.addBody(mundo, this.body);
    }

    // Remove as referências desse carro da engine de física
    public remover(mundo: World) {
        World.remove(mundo, this.body);
    }

    public getTransform() {
        return {
            position: this.body.position,
            angle: this.body.angle
        };
    }
}
