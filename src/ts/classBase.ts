const scoreBoard = document.querySelector("#score");
const resetBtn = document.querySelector("#reset");
const canvas = <HTMLCanvasElement>document.querySelector("#canvas");
const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
const TILE_COUNT: number = 30,
	TILE_SIZE: number = 25,
	WIDTH: number = canvas.width,
	HEIGHT: number = canvas.height,
	SHADOW_SIZE: number = 20;

enum KEYS {
	UP = "ArrowUp",
	DOWN = "ArrowDown",
	LEFT = "ArrowLeft",
	RIGHT = "ArrowRight",
	SPACE = "Space",
}

let velocity: [number, number , KEYS] = [0, 0 , null],
	deltaTime: number = 0,
	speed: number = 100,
	score: number = 0,
	tailLength: number = 0,
	isGameFinished: boolean = false;


enum COLORS {
	SHEAD = "#FFF",
	SHEAD_SHADOW = "rgba(255,255,255,0.3 )",
	SBODY = "#E1E1E1",
	TILE_BORDER = "#222738",
	TILE = "#181825",
	APPLE = "red",
	// TODO: find mild shadow color
	APPLE_SHADOW = "red",
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

	changeSnakePositon = (): void => {
		this.head.x += velocity[0];
		this.head.y += velocity[1];
	};

	drawSnake = (): void => {
		ctx.fillStyle = COLORS.SBODY;
		for (let part of this.body) {
			ctx.fillRect(part.x * TILE_SIZE, part.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
		}

		this.body.push(this.head);
		if (this.body.length > tailLength) {
			this.body.shift();
		}
		
		ctx.fillStyle = this.head.color;
		ctx.shadowColor = COLORS.SHEAD_SHADOW;
		ctx.shadowBlur = SHADOW_SIZE;
		ctx.fillRect(
			this.head.x * TILE_SIZE,
			this.head.y * TILE_SIZE,
			TILE_SIZE,
			TILE_SIZE
		);
		ctx.shadowBlur = 0;
	};
}
const snake: Snake = new Snake();

class Apple {
	position: Tile;
	constructor() {
		// TODO: create random colors for apple
		
		this.position = this.randomGenerator();
	}

	randomGenerator = (): Tile => {
		const xPos: number = Math.floor(Math.random() * TILE_COUNT),
			yPos: number = Math.floor(Math.random() * TILE_COUNT);
		return new Tile(xPos, yPos, COLORS.APPLE);
	};

	drawApple = (): void => {
		ctx.shadowColor = COLORS.APPLE_SHADOW;
		ctx.shadowBlur = SHADOW_SIZE;
		ctx.fillStyle = this.position.color;
		ctx.fillRect(
			this.position.x * TILE_SIZE,
			this.position.y * TILE_SIZE,
			TILE_SIZE,
			TILE_SIZE
		);
		ctx.shadowBlur = 0;
	};

	checkAppleCollision = (): void => {
		if (this.position.x == snake.head.x && this.position.y == snake.head.y) {
			this.position = this.randomGenerator();
			tailLength++;
			score++;
		}
	};
}
const apple: Apple = new Apple();

window.addEventListener("keydown", (e) => {
	switch (e.code) {
		case KEYS.DOWN:
			if (velocity[2] == KEYS.UP) {
				return;
			}
			velocity = [0, 1 , KEYS.DOWN];
			break;
		case KEYS.UP:
			if (velocity[2] == KEYS.DOWN) {
				return;
			}
			velocity = [0, -1, KEYS.UP];
			break;
		case KEYS.RIGHT:
			if (velocity[2] == KEYS.LEFT) {
				return;
			}
			velocity = [1, 0 , KEYS.RIGHT];
			break;
		case KEYS.LEFT:
			if (velocity[2] == KEYS.RIGHT) {
				return;
			}
			velocity = [-1, 0 , KEYS.LEFT];
			break;
	}
});

class Game {
	drawTileMap = (): void => {
		ctx.strokeStyle = COLORS.TILE_BORDER;
		ctx.fillStyle = COLORS.TILE;
		for (let i: number = 0; i < TILE_COUNT; i++) {
			for (let j: number = 0; j < TILE_COUNT; j++) {
				ctx.fillRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
				ctx.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
			}
		}
	};

	drawGame = (time: number): void => {
		if (time - deltaTime < speed) {
		} else {
			snake.changeSnakePositon();
			apple.checkAppleCollision();
			this.drawTileMap();
			apple.drawApple();
			snake.drawSnake();
			deltaTime = time;
		}
		requestAnimationFrame(this.drawGame);
	};
}
const game: Game = new Game();
requestAnimationFrame(game.drawGame);
