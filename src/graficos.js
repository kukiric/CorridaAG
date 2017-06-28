// Cria e adiciona o canvas no html
const elemento = document.createElement("canvas");
elemento.width = 800;
elemento.height = 600;
document.getElementById("content").appendChild(elemento);
const canvas = elemento.getContext("2d");

class Graficos {
    static atualizar() {
        // Manipula o canvas
        canvas.fillStyle = "red";
        canvas.fillRect(20, 20, 640, 480);
        canvas.stroke();
    }
}

module.exports = Graficos;
