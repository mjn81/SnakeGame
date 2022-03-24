const scoreBoard = <HTMLElement>document.querySelector("#score");
const resetBtn = <HTMLElement>document.querySelector("#reset");
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
	NULL = ""
}

let velocity: [number, number , KEYS] = [0, 0 , KEYS.NULL],
	deltaTime: number = 0,
	speed: number = 100,
	score: number = 0,
	tailLength: number = 0,
	isGameOver: boolean = false;


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
		const h: Tile = this.head; 
		if (h.x >= TILE_COUNT) {
			h.x = 0;
		} else if (h.y >= TILE_COUNT) {
			h.y = 0;
		}
		else if (h.x < 0) {
			h.x = TILE_COUNT;
		} else if (h.y < 0) {
			h.y = TILE_COUNT;
		}
		h.x += velocity[0];
		h.y += velocity[1];
	};

	checkSnakeCollection = (): void => {
		const h: Tile = this.head;
		for (let part of this.body) {
			if (part.x == h.x && part.y == h.y) {
				isGameOver = true;
			}
		}
	}

	drawSnake = (): void => {
		const h :Tile = this.head;
		ctx.fillStyle = COLORS.SBODY;
		for (let part of this.body) {
			ctx.fillRect(part.x * TILE_SIZE, part.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
		}

		this.body.push(new Tile(h.x, h.y, KEYS.NULL));
		while (this.body.length > tailLength) {
			this.body.shift();
		}
		
		ctx.fillStyle = h.color;
		ctx.shadowColor = COLORS.SHEAD_SHADOW;
		ctx.shadowBlur = SHADOW_SIZE;
		ctx.fillRect(
			h.x * TILE_SIZE,
			h.y * TILE_SIZE,
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
			if (score < 10) {
				scoreBoard.textContent = "0" + score;
			} else {
				scoreBoard.textContent = score.toString();
			}
		}
	};
}

const apple: Apple = new Apple();

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

	drawGameOver = (): void => {
		ctx.fillStyle = COLORS.TILE;
		ctx.fillRect(0 , 0 , WIDTH, HEIGHT);
		ctx.fillStyle = COLORS.TILE_BORDER;
		ctx.font = "italic bold 50px Poppins";
		ctx.fillText("Game Over", WIDTH / 2 - 145, HEIGHT / 2 + 20);
	}

	drawGame = (time: number): void => {
		if (time - deltaTime < speed) {
		} else {
			if (isGameOver) {
				this.drawGameOver();
				return;	
			}
			snake.changeSnakePositon();
			snake.checkSnakeCollection();
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

window.addEventListener("keydown", (e) => {
	if (isGameOver) {
		return;
	}
	switch (e.code) {
		case KEYS.DOWN:
			if (velocity[2] == KEYS.UP) {
				return;
			}
			velocity = [0, 1, KEYS.DOWN];
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
			velocity = [1, 0, KEYS.RIGHT];
			break;
		case KEYS.LEFT:
			if (velocity[2] == KEYS.RIGHT) {
				return;
			}
			velocity = [-1, 0, KEYS.LEFT];
			break;
	}
});

resetBtn.addEventListener("click", (): void => {
	try {
		score = 0;
		tailLength = 0;
		isGameOver = false;
		scoreBoard.textContent = "00";
		requestAnimationFrame(game.drawGame);
	}
	catch (e) {
		console.log(e);
	}
});

requestAnimationFrame(game.drawGame);
