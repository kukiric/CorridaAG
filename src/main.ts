import {Graficos} from "./graficos";
import {Pista} from "./pista";
import {Carro} from "./carro";

// Cria a pista
const pista = new Pista([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
    [1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]);

// Cria os carros
let carros = new Array<Carro>();
for (let i = 0; i < 10; i++) {
    carros.push(new Carro());
}

let ultimoTempo = performance.now();

// Define a função principal
let main = () => {
    let tempoAtual = performance.now();
    Graficos.atualizar(pista, carros, tempoAtual - ultimoTempo);
    ultimoTempo = tempoAtual;
    requestAnimationFrame(main);
}

// Entra em loop
requestAnimationFrame(main);
