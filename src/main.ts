import * as Matter from "matter-js";
import Tela from "./tela";
import Pista from "./pista";
import Carro from "./carro";

declare global {
    interface Window {
        engine: Matter.Engine;
    }
}

// Inicializa a física
window.engine = Matter.Engine.create();

// Cria a pista
const pista = new Pista([
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
let posInicio = pista.getPosInicio();
for (let i = 1; i < 10; i++) {
    carros.push(new Carro(posInicio.x, posInicio.y));
}

// Define R para trocar o modo de depuração
window.addEventListener("keypress", (ev) => {
    if (ev.key == "r") {
        Tela.debug = !Tela.debug;
    }
})

let ultimoTempo = performance.now();

// Define a função principal
let main = () => {
    let tempoAtual = performance.now();
    Tela.atualizar(pista, carros, tempoAtual - ultimoTempo);
    ultimoTempo = tempoAtual;
    requestAnimationFrame(main);
}

// Entra em loop assim que as sprites forem carregadas
let loop = setInterval(() => {
    if (Tela.tudoPronto()) {
        clearInterval(loop);
        requestAnimationFrame(main);
    }
}, 10);
