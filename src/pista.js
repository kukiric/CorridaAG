const Poligono = require("./poligono.js");

class Pista {
    constructor(vertices) {
        if (vertices == undefined) {
            throw("Pista.constructor: Parâmetro poligonos não pode ser vazio!");
        }
        this.poligonos = new Array(vertices.length / 2);
        for (var i = 0; i < vertices.length; i += 2) {
            this.poligonos[i] = new Poligono({
                x: vertices[i], y: vertices[i+1]
            });
            
        }
    }
}

module.exports = Pista;
