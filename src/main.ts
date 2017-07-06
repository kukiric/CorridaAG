import * as Matter from "matter-js";
import * as Neataptic from "neataptic";
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

// Define R para trocar o modo de depuração
window.addEventListener("keypress", (ev) => {
    if (ev.key == "r") {
        Tela.debug = !Tela.debug;
    }
    else if (ev.key == " ") {
        simulando = false;
    }
});

let simulando = true;
let geracao = 1;
const posInicio = window.pista.getPosInicio();
const numCarros = 20;
let carros: Carro[] = [];
// Cria os cromossomos
let neat = new Neataptic.Neat(Carro.raiosChecagem.length, 2, null, {
    mutationRate: 0.1,
    popSize: numCarros,
    mutation: [
        Neataptic.Methods.Mutation.ADD_NODE,
        Neataptic.Methods.Mutation.SUB_NODE,
        Neataptic.Methods.Mutation.ADD_CONN,
        Neataptic.Methods.Mutation.SUB_CONN,
        Neataptic.Methods.Mutation.MOD_WEIGHT,
        Neataptic.Methods.Mutation.MOD_BIAS,
        Neataptic.Methods.Mutation.MOD_ACTIVATION,
        Neataptic.Methods.Mutation.ADD_GATE,
        Neataptic.Methods.Mutation.SUB_GATE,
        Neataptic.Methods.Mutation.ADD_SELF_CONN,
        Neataptic.Methods.Mutation.SUB_SELF_CONN,
        Neataptic.Methods.Mutation.ADD_BACK_CONN,
        Neataptic.Methods.Mutation.SUB_BACK_CONN
    ]
});


// Define a função principal
let main = () => {
    // Cria a próxima geraçào
    if (!simulando) {
        Tela.limpar();
        // Cria a nova população com cruzamento
        let popNova = neat.population.map(() => {
            return neat.getOffspring();
        });
        // Mutação
        neat.mutate();
        // Remove os carros antigos da engine de física
        carros.forEach(carro => carro.remover(window.engine.world));
        // Constroi os carros com os novos cromossomos
        carros = neat.population.map(gene => {
            let novo = new Carro(posInicio.x, posInicio.y, gene as Neataptic.Network);
            novo.registrar(window.engine.world);
            return novo;
        });
        // Volta à simulação
        simulando = true;
        console.log("Geracao ", geracao++);
        Tela.geracao = geracao;
    }
    // Atualiza a simulação    
    else {
        Matter.Engine.update(window.engine, 1/60);
        carros.forEach(carro => carro.update(1/60));
        // Termina a geração quando todos os carros estiverem parados
        // if (carros.every(carro => carro.morto)) {
        //     simulando = false;
        // }
        Tela.atualizar(window.pista, carros);
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
        requestAnimationFrame(main);
    }
}, 10);
