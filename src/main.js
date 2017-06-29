const synaptic = require("synaptic");
const Graficos = require("./graficos.js");
const Genetica = require("./genetica.js");
const Logica = require("./logica.js");
const Pista = require("./pista.js");
const Carro = require("./carro.js");

// Cria a pista
pista = new Pista([
    10, 10,
    15, 10,
    10, 15
]);

// Cria todos os carros
carros = new Array(10);
for (var i = 0; i < 10; i++) {
    carros[i] = new Carro();
}

Graficos.atualizar(pista, carros);
