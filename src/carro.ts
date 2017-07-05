import * as Synaptic from "synaptic";
import * as Matter from "matter-js";
import * as _ from "lodash";
import Tela from "./tela";
import Cromossomo from "./ag";

interface Raycast {
    inicio: Matter.Vector;
    fim: Matter.Vector;
    objetos: any[];
}

export default class Carro {

    private static raiosChecagem = [
        // Ângulo em graus e distância
        [-60, 66],
        [-45, 83],
        [-25, 112],
        [-10, 125],
        [  0, 133],
        [ 10, 125],
        [ 25, 112],
        [ 45, 83],
        [ 60, 66],
    ];

    private obj: Matter.Body;
    private blocoAtual: number;
    private raycasts: Raycast[];
    private rede: Synaptic.Network;
    public cromossomo: Cromossomo;
    public nomeSprite: string;

    constructor(x: number, y: number, gene?: Cromossomo) {
        this.obj = Matter.Bodies.rectangle(x, y, 14, 24);
        // Colide somente com as paredes (último bit)
        this.obj.collisionFilter.mask = 0b0001;
        // Categoria dos carros (penúltimo bit)
        this.obj.collisionFilter.category = 0b0010;
        (this.obj as any).carro = this;
        this.blocoAtual = 1;
        this.nomeSprite = _.sample(Object.keys(Tela.sprites));
        if (gene == undefined) {
            gene = Cromossomo.aleatorio();
        }
        this.cromossomo = gene;
        this.cromossomo.mutar();
        this.cromossomo.cruzar(this.cromossomo);
        this.rede = Synaptic.Network.fromJSON(this.cromossomo.redeJson);
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
            let objetos = Matter.Query.ray(window.pista.paredes, inicio, fim);
            return <Raycast>{
                inicio: inicio,
                fim: fim,
                objetos: objetos
            };
        });
        // Aplica a rede neural
        let saidas = this.rede.activate(this.raycasts.map(raio => (raio.objetos.length > 0) ? 1 : 0));
        let forcaEsquerda = saidas[0];
        let forcaDireita = saidas[1];
        let direcao = forcaDireita - forcaEsquerda;
        Matter.Body.setAngularVelocity(this.obj, 0.1 * direcao);
    }
}
