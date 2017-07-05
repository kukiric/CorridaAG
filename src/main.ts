import * as Matter from "matter-js";
import Cromossomo from "./ag";
import Tela from "./tela";
import Pista from "./pista";
import Carro from "./carro";

declare global {
    interface Window {
        engine: Matter.Engine;
        pista: Pista;
        fim: boolean;
    }
}

// Inicializa a física
window.engine = Matter.Engine.create();

// Cria a pista
window.pista = new Pista([
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  8,  9,  10, 0,  14, 15, 16, 0,
    0,  0,  6,  7,  0,  11, 12, 13, 0,  17, 0,
    0,  4,  5,  0,  0,  0,  0,  0,  0,  18, 0,
    0,  3,  0,  0,  0,  0,  0,  0,  0,  19, 0,
    0,  2,  0,  0,  27, 26, 25, 0,  0,  20, 0,
    0,  1,  0,  0,  28, 0,  24, 23, 22, 21, 0,
    0,  32, 31, 30, 29, 0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0
], 11, 100, window.engine.world);

// Cria os carros
let carros = new Array<Carro>();
let posInicio = window.pista.getPosInicio();
for (let i = 0; i < 20; i++) {
    let carro = new Carro(posInicio.x, posInicio.y);
    carro.registrar(window.engine.world);
    carros.push(carro);
}

// Define R para trocar o modo de depuração
window.addEventListener("keypress", (ev) => {
    if (ev.key == "r") {
        Tela.debug = !Tela.debug;
    }
});

let simulando = true;
let geracao = 1;

// Define a função principal
let main = () => {
    // Atualiza a simulação
    if (simulando) {
        Matter.Engine.update(window.engine, 1/60);
        carros.forEach(carro => carro.update(1/60));
        // Termina a geração quando todos os carros estiverem parados
        if (carros.every(carro => carro.morto)) {
            simulando = false;
        }
        Tela.atualizar(window.pista, carros);
    }
    // Cria a próxima geraçào
    else {
        Tela.limpar();
        // Extrai os cromossomos
        let cromossomos = carros.map(carro => carro.cromossomo);
        // Mutação (10%)
        cromossomos.forEach((gene, i) => {
            if (Math.random() < 0.1) {
                gene.causarMutacao();
                console.log("Mutação causada no indivíduo " + i);
            }
        });
        // Cruzamento (2 em 2)
        let chances = Cromossomo.vetorChances(cromossomos);
        cromossomos.map(() => {
            let pais = Cromossomo.selecao(chances);
            return cromossomos[pais.a].cruzar(cromossomos[pais.b]);
        });
        // Reconstroi os carros com os novos cromossomos
        carros = carros.map((carro, i) => {
            carro.remover(window.engine.world);
            let novo = new Carro(posInicio.x, posInicio.y, cromossomos[i]);
            novo.registrar(window.engine.world);
            return novo;
        });
        // Volta à simulação
        simulando = true;
        geracao++;
        alert("Geracao " + geracao);
    }
    if (window.fim) {
        alert("Corrida concluída!");
    }
    else {
        requestAnimationFrame(main);
    }
};

// Entra em loop assim que as sprites forem carregadas
let loop = setInterval(() => {
    if (Tela.tudoPronto()) {
        clearInterval(loop);
        window.fim = false;
        alert("Geracão " + geracao);
        requestAnimationFrame(main);
    }
}, 10);
