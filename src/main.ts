import {Graficos} from "./graficos";
import {Pista} from "./pista";
import {Carro} from "./carro";

// Cria a pista
const pista = new Pista([
    [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [0,  0,  0,  8,  9,  10, 0,  0,  0,  0,  0],
    [0,  0,  6,  7,  0,  11, 12, 12, 13, 0,  0],
    [0,  0,  5,  0,  0,  12, 0,  0,  13, 0,  0],
    [0,  3,  4,  0,  0,  13, 14, 0,  14, 0,  0],
    [0,  2,  0,  0,  0,  0,  15, 15, 14, 0,  0],
    [0,  1,  0,  19, 18, 17, 16, 0,  0,  0,  0],
    [0,  22, 21, 20, 0,  0,  0,  0,  0,  0,  0],
    [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
], 22);

// Cria os carros
let carros = new Array<Carro>();
for (let i = 1; i < 10; i++) {
    carros.push(new Carro());
}

Graficos.debug = true;

let ultimoTempo = performance.now();

// Define a função principal
let main = () => {
    let tempoAtual = performance.now();
    Graficos.atualizar(pista, carros, tempoAtual - ultimoTempo);
    ultimoTempo = tempoAtual;
    requestAnimationFrame(main);
}

// Entra em loop assim que as sprites forem carregadas
let loop = setInterval(() => {
    if (Graficos.tudoPronto()) {
        clearInterval(loop);
        requestAnimationFrame(main);
    }
}, 10);
