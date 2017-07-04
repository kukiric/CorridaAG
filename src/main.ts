import * as synaptic from "synaptic";
import {Graficos} from "./graficos";
import {Pista} from "./pista";
import {Carro} from "./carro";

// Cria a pista
const pista = new Pista([
    [1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
    [1, 1, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]);

// Cria os carros
let carros = new Array<Carro>();
for (let i = 0; i < 10; i++) {
    carros.push(new Carro());
}

console.log(carros[2].i);

Graficos.atualizar(pista, null);
