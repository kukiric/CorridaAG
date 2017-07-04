import {Pista} from "./pista";

// Pega o canvas do HTML
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 768;

export class Graficos {
    public static atualizar(pista: Pista, carros: any) {
        let bloco = {
            largura: canvas.width / pista.largura,
            altura: canvas.height / pista.altura
        };
        ctx.imageSmoothingEnabled = false;
        // Manipula o canvas
        pista.matriz.forEach((linha, j) => {
            linha.forEach((elemento, i) => {
                if (elemento == 0) {
                    ctx.fillStyle = "#878787";
                }
                else {
                    ctx.fillStyle = "#8AC466";
                }
                ctx.fillRect(i * bloco.largura, j * bloco.altura, bloco.largura, bloco.altura);
            });
        });
        ctx.stroke();
    }
}
