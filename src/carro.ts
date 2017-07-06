import * as Neataptic from "neataptic";
import * as Matter from "matter-js";
import * as _ from "lodash";
import Tela from "./tela";
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

    public static raiosChecagem = [
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
    private score: number;
    private raycasts: Raycast[];
    private tempoParado: number;
    public rede: Neataptic.Network;
    public nomeSprite: string;
    public morto: boolean;

    constructor(x: number, y: number, rede?: Neataptic.Network) {
        this.obj = Matter.Bodies.rectangle(x, y, 14, 24);
        this.obj.carro = this;
        // Colide somente com as paredes (último bit)
        this.obj.collisionFilter.mask = 0b0001;
        // Categoria dos carros (penúltimo bit)
        this.obj.collisionFilter.category = 0b0010;
        this.obj.label = "Carro";
        this.score = 0;
        this.nomeSprite = _.sample(Object.keys(Tela.sprites));
        this.tempoParado = 0;
        this.morto = false;
        this.rede = rede
        Matter.Events.on(window.engine, "collisionStart", (evento) => {
            // Checa se a colisão é com o chão
            evento.pairs.forEach(par => {
                let outro = par.bodyA as ChaoPista;
                if (outro.label === "Chão") {
                    this.atualizaBloco(outro.numero);
                }
                else {
                    outro = par.bodyB as ChaoPista;
                    if (outro.label === "Chão") {
                        this.atualizaBloco(outro.numero);
                    }
                }
            });
        });
    }

    public atualizaBloco(novoBloco: number) {
        // Aumenta o fitness se avançar pra frente
        if (novoBloco == this.score + 1) {
            this.rede.score++;
            this.tempoParado = 0;
            if (novoBloco > Tela.melhor) {
                Tela.melhor = this.rede.score;
            }
        }
        // Completa a simulação
        else if (this.score == window.pista.max && novoBloco == 1) {
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
        let forcaAceleracao = {x: 0, y: -2.5};
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
            return;
        }
        // Aplica a rede neural
        let entradas = this.raycasts.map(raio => (raio.objetos.length > 0) ? 1 : 0);
        let saidas = this.rede.activate(entradas);
        let forcaEsquerda = _.clamp(saidas[0], 0, 1);
        let forcaDireita = _.clamp(saidas[1], 0, 1);
        let direcao = forcaDireita - forcaEsquerda;
        Matter.Body.setAngularVelocity(this.obj, 0.25 * direcao);
    }
}
