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

    public static debug = false;
    public static melhor = 0;
    public static geracao = 1;

    // Checa se todas as sprites estão carregadas
    public static tudoPronto() {
        return Object.keys(Tela.sprites).every(spr => {
            return Tela.sprites[spr].carregada;
        })
    }

    // Limpa a tela
    public static limpar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Pinta a tela
    public static atualizar(pista: Pista, carros: Carro[]) {
        Tela.limpar();
        // Desenha o fundo e a pista
        ctx.imageSmoothingEnabled = false;
        ctx.lineWidth = 1;
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
                    ctx.strokeStyle = "black";
                    ctx.rect(x, y, pista.escala, pista.escala);
                    ctx.stroke();
                }
            }
        });
        // Desenha os raycasts
        if (Tela.debug) {
            carros.filter(carro => !carro.morto).forEach(carro => {
                carro.getRaycasts().forEach(raio => {
                    ctx.beginPath();
                    if (raio.objetos.length > 0) {
                        ctx.strokeStyle = "red";
                    }
                    else {
                        ctx.strokeStyle = "white";
                    }
                    ctx.moveTo(raio.inicio.x, raio.inicio.y);
                    ctx.lineTo(raio.fim.x, raio.fim.y);
                    ctx.stroke();
                });
            });
        }
        // Desenha os carros
        ctx.imageSmoothingEnabled = true;
        carros.forEach(carro => {
            ctx.save();
            let transform = carro.getTransform();
            let imagem: HTMLImageElement = Tela.sprites[carro.nomeSprite].imagem;
            // Transformação global
            ctx.translate(transform.position.x, transform.position.y);
            // Transformação local
            ctx.scale(0.2, 0.2);
            ctx.rotate(transform.angle);
            ctx.drawImage(imagem, -imagem.width/2, -imagem.height/2);
            ctx.restore();
        });
        // Desenha o melhor fitness até agora
        ctx.fillStyle = "white";
        ctx.font = "40px sans-serif";
        ctx.fillText("Melhor fitness: " + Tela.melhor, 16, 56);
        ctx.fillText("Geracão: " + Tela.geracao, 16, 96);
    }
}
