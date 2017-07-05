import * as Synaptic from "synaptic";
import * as Matter from "matter-js";
import * as _ from "lodash";
import Tela from "./tela";
import Cromossomo from "./ag";
import {ChaoPista} from "./pista";

interface Raycast {
    inicio: Matter.Vector;
    fim: Matter.Vector;
    objetos: any[];
}

export interface BodyCarro extends Matter.Body {
    carro?: Carro
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

    private obj: BodyCarro;
    private blocoAtual: number;
    private raycasts: Raycast[];
    private rede: Synaptic.Network;
    private tempoParado: number;
    public cromossomo: Cromossomo;
    public nomeSprite: string;
    public morto: boolean;

    constructor(x: number, y: number, gene?: Cromossomo) {
        this.obj = Matter.Bodies.rectangle(x, y, 14, 24);
        this.obj.carro = this;
        // Colide somente com as paredes (último bit)
        this.obj.collisionFilter.mask = 0b0001;
        // Categoria dos carros (penúltimo bit)
        this.obj.collisionFilter.category = 0b0010;
        this.blocoAtual = 0;
        this.nomeSprite = _.sample(Object.keys(Tela.sprites));
        this.tempoParado = 0;
        this.morto = false;
        if (gene == undefined) {
            gene = Cromossomo.aleatorio();
        }
        this.cromossomo = gene;
        this.cromossomo.fitness = this.blocoAtual;
        this.rede = Synaptic.Network.fromJSON(this.cromossomo.redeJson);
        Matter.Events.on(window.engine, "collisionStart", this.onColisao.bind(this));
    }

    public onColisao(evento: Matter.IEventCollision<Matter.Engine>) {
        // Checa se a colisão é com o chão
        evento.pairs.forEach(par => {
            let chao = par.bodyA as ChaoPista;
            if (chao.numero !== undefined) {
                this.atualizaBloco(chao.numero);
            }
            else {
                chao = par.bodyA as ChaoPista;
                if (chao.numero !== undefined) {
                    this.atualizaBloco(chao.numero);
                }
            }
        })
    }

    public atualizaBloco(novoBloco: number) {
        // Aumenta o fitness se avançar pra frente
        if (novoBloco == this.blocoAtual + 1) {
            this.blocoAtual = novoBloco;
            this.cromossomo.fitness = novoBloco;
            this.tempoParado = 0;
            if (novoBloco > Tela.melhor) {
                Tela.melhor = novoBloco;
            }
        }
        // Completa a simulação
        else if (this.blocoAtual == window.pista.max && novoBloco == 1) {
            window.fim = true;
        }
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

    public update(delta: number) {
        // Não anda depois de morrer
        if (this.morto) {
            return;
        }
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
        // Morre se ficar parado por muito tempo
        this.tempoParado += delta;
        if (this.tempoParado > 3) {
            this.morto = true;
            console.log("rip");
            return;
        }
        // Aplica a rede neural
        let entradas = this.raycasts.map(raio => (raio.objetos.length > 0) ? 1 : 0);
        let saidas = this.rede.activate(entradas);
        let forcaEsquerda = saidas[0];
        let forcaDireita = saidas[1];
        let direcao = forcaDireita - forcaEsquerda;
        Matter.Body.setAngularVelocity(this.obj, 0.25 * direcao);
    }
}
