const synaptic = require("synaptic");
const Graficos = require("./graficos.js");
const Genetica = require("./genetica.js");
const Logica = require("./logica.js");
const Carro = require("./carro.js");

// Cria todos os carros
carros = [];
for (var i = 0; i < 10; i++) {
    carros.push(new Carro());
}

Graficos.atualizar();
