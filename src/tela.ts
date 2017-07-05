import Pista from "./pista";
import Carro from "./carro";

// Pega o canvas do HTML
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
canvas.width = 1100;
canvas.height = 900;

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

export default class Tela {

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
        return Object.keys(Tela.sprites).every(spr => {
            return Tela.sprites[spr].carregada;
        })
    }

    // Pinta a tela
    public static atualizar(pista: Pista, carros: Carro[], delta: number) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        // Manipula o canvas
        pista.matriz.forEach((elemento, pos) => {
            const x = pista.posReal(pos).x;
            const y = pista.posReal(pos).y;
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
            ctx.fillRect(x, y, pista.escala, pista.escala);
            // Desenha texto sobre os tiles em modo de depuração
            if (Tela.debug) {
                if (elemento > 0) {
                    let texto = elemento.toString();
                    let largura = ctx.measureText(texto).width;
                    let altura = 40;
                    ctx.fillStyle = "#3C3C3C";
                    ctx.font = "bold " + altura + "px sans-serif";
                    ctx.fillText(texto, x - largura/2 + pista.escala/2, y + altura/3 + pista.escala/2);
                }
            }
        });
        // Desenha os carros
        carros.forEach(carro => {
            ctx.save();
            let transform = carro.getTransform();
            let imagem: HTMLImageElement = Tela.sprites[carro.nomeSprite].imagem;
            // Transformação global
            ctx.translate(transform.position.x, transform.position.y);
            // Transformação local
            ctx.scale(0.2, 0.2);
            ctx.rotate(transform.angle);
            ctx.translate(-imagem.width/2, -imagem.height/2);
            ctx.drawImage(imagem, 0, 0);
            ctx.restore();
        });
    }
}
