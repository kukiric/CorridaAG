import Pista from "./pista";
import Carro from "./carro";

// Pega o canvas do HTML
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 768;

export class Sprite {
    public caminho: string;
    public imagem: HTMLImageElement;
    public carregada: boolean;

    public constructor(caminho: string) {
        this.caminho = caminho;
        this.imagem = new Image();
        this.imagem.onload = (ev) => {
            this.carregada = true;
        }
        this.imagem.onerror = (ev) => {
            alert("Não foi possível carregar a sprite: " + this.imagem.src);
        }
        this.imagem.src = caminho;
    }
}

export default class Graficos {

    public static sprites = {
        carroPreto: new Sprite("sprites/car_black_5.png"),
        carroAzul: new Sprite("sprites/car_blue_5.png"),
        carroVerde: new Sprite("sprites/car_green_5.png"),
        carroVermelho: new Sprite("sprites/car_red_5.png"),
        carroAmarelo: new Sprite("sprites/car_yellow_5.png"),
    };

    public static debug: boolean = false;

    // Checa se todas as sprites estão carregadas
    public static tudoPronto() {
        return Object.keys(Graficos.sprites).every(spr => {
            return Graficos.sprites[spr].carregada;
        })
    }

    // Pinta a tela
    public static atualizar(pista: Pista, carros: Carro[], delta: number) {
        let bloco = {
            largura: canvas.width / pista.largura,
            altura: canvas.height / pista.altura
        };
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        // Manipula o canvas
        pista.matriz.forEach((linha, j) => {
            linha.forEach((elemento, i) => {
                const x = i * bloco.largura;
                const y = j * bloco.altura;
                // Grama (parede)
                if (elemento == 0) {
                    ctx.fillStyle = "#8AC466";
                }
                // Faixa de partida
                else if (elemento == 1) {
                    ctx.fillStyle = "#A2A2A2";
                }
                // Pista comum
                else {
                    ctx.fillStyle = "#878787";
                }
                ctx.fillRect(x, y, bloco.largura, bloco.altura);
                // Desenha texto sobre os tiles em modo de depuração
                if (Graficos.debug) {
                    let texto = elemento.toString();
                    let largura = ctx.measureText(texto).width;
                    let altura = 40;
                    ctx.fillStyle = "white";
                    ctx.font = "bold " + altura + "px sans-serif";
                    ctx.fillText(texto, x - largura/2 + bloco.largura/2, y + altura/3 + bloco.altura/2);
                }
            });
        });
    }
}
