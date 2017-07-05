import * as Synaptic from "synaptic";
import * as Matter from "matter-js";
import * as _ from "lodash";
import Tela from "./tela";
import AG from "./ag";

interface Raycast {
    inicio: Matter.Vector;
    fim: Matter.Vector;
    objetos: any[];
}

export default class Carro {

    private static raiosChecagem = [
        // Ângulo em graus e distância
        [-60, 75],
        [-45, 83],
        [-25, 112],
        [-10, 125],
        [  0, 133],
        [ 10, 125],
        [ 25, 112],
        [ 45, 83],
        [ 60, 75],
    ];

    private obj: Matter.Body;
    private net: Synaptic.Network;
    private blocoAtual: number;
    private raycasts: Raycast[];
    public nomeSprite: string;
    public fitness: number;

    constructor(x: number, y: number, rede?: Synaptic.Network) {
        this.obj = Matter.Bodies.rectangle(x, y, 14, 24);
        // Colide somente com as paredes (último bit)
        this.obj.collisionFilter.mask = 0b0001;
        // Categoria dos carros (penúltimo bit)
        this.obj.collisionFilter.category = 0b0010;
        this.blocoAtual = 1;
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

    public getRaycasts() {
        return this.raycasts;
    }

    public update() {
        // Move o carro
        let forcaAceleracao = {x: 0, y: -2};
        let forcaDirecionada = Matter.Vector.rotate(forcaAceleracao, this.obj.angle);
        Matter.Body.setVelocity(this.obj, forcaDirecionada);
        // Verifica as colisões
        this.raycasts = Carro.raiosChecagem.map(raio => {
            let angulo = raio[0] * Math.PI / 180;
            let direcao = Matter.Vector.rotate({x: 0, y: -raio[1]}, this.obj.angle + angulo);
            let inicio = this.obj.position;
            let fim = Matter.Vector.add(inicio, direcao);
            let objetos = Matter.Query.ray(window.pista.objs, inicio, fim);
            return <Raycast>{
                inicio: inicio,
                fim: fim,
                objetos: objetos
            };
        });
        // Aplica a rede neural
        let saidas = this.net.activate(this.raycasts.map(raio => (raio.objetos.length > 0) ? 1 : 0));
        let forcaEsquerda = saidas[0];
        let forcaDireita = saidas[1];
        let direcao = forcaDireita - forcaEsquerda;
        Matter.Body.setAngularVelocity(this.obj, 0.1 * direcao);
    }
}
