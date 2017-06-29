const Vertice = require("./vertice.js");

class Poligono {
    constructor(vertices, cor) {
        this.vertices = vertices || new Array();
        this.cor = cor || "red";
    }
}

module.exports = Poligono;
