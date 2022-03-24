const scoreBoard = document.querySelector("#score");
const resetBtn = document.querySelector("#reset");
const canvas = <HTMLCanvasElement>document.querySelector("#canvas");
const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");
const TILE_COUNT: number = 30, TILE_SIZE: number = 25;
let velocity: [number, number] = [0, 0],
	score: number = 0,
	tailLength: number = 0;

enum KEYS {
	UP = "ArrowUp",
	DOWN = "ArrowDown",
	LEFT = "ArrowLeft",
	RIGHT = "ArrowRight",
	SPACE = "Space",
}

enum COLORS {
	SHEAD = "#FFF",
	SBODY = "##E1E1E1",
}

class Tile {
	x: number;
	y: number;
	color: string;
	constructor(x: number, y: number, color: string) {
		this.x = x;
		this.y = y;
		this.color = color;
	}
}

class Snake {
	head: Tile;
	body: Tile[];
	constructor() {
		this.head = new Tile(2, 2, COLORS.SHEAD);
		this.body = [];
    }
    
    drawSnake = (): void => {
        ctx.fillStyle = this.head.color;
        ctx.shadowColor = "rgba(255,255,255,.3 )";
        ctx.shadowBlur = 20;
        ctx.fillRect(this.head.x * TILE_SIZE, this.head.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.shadowBlur = 0;
    }
}

window.addEventListener("keydown", (e) => {
	switch (e.code) {
		case KEYS.DOWN:
			break;
	}
});
const snake: Snake = new Snake();

class Game {
    drawGame = (deltaTime: number): void => {
        
        snake.drawSnake();
		requestAnimationFrame(this.drawGame);
	};
}
const game: Game = new Game();
requestAnimationFrame(game.drawGame);
