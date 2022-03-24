const canvas = <HTMLCanvasElement>document.querySelector("#canvas");
const resetBtn = <Element>document.querySelector("#resetBtn");
const ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>(
	canvas.getContext("2d")
);
const w: number = canvas.width;
const h: number = canvas.height;
const speed: number = 150;
const tileCount: number = 30;
const tileSize: number = w / tileCount;

const enum DIRECTION {
	UP = "ArrowUp",
	DOWN = "ArrowDown",
	LEFT = "ArrowLeft",
	RIGHT = "ArrowRight",
}
let start: number = 0;
const head: [number, number] = [5, 5];
const apple: [number, number] = [
	Math.floor(Math.random() * (tileCount - 8) + 3),
	Math.floor(Math.random() * (tileCount - 8) + 3),
];
let velocity: [number, number] = [0, 0];
let direction: DIRECTION | null = null;
let score = 0;
let isGameFinished: boolean = false;
window.addEventListener("keydown", (event) => {
	switch (event.code) {
		case DIRECTION.UP:
			if (direction === DIRECTION.DOWN) {
				return;
			}
			direction = DIRECTION.UP;
			velocity = [0, -1];
			break;
		case DIRECTION.DOWN:
			if (direction === DIRECTION.UP) {
				return;
			}
			direction = DIRECTION.DOWN;
			velocity = [0, 1];
			break;
		case DIRECTION.LEFT:
			if (direction === DIRECTION.RIGHT) {
				return;
			}
			direction = DIRECTION.LEFT;
			velocity = [-1, 0];
			break;
		case DIRECTION.RIGHT:
			if (direction === DIRECTION.LEFT) {
				return;
			}
			direction = DIRECTION.RIGHT;
			velocity = [1, 0];
			break;
	}
});

class SnakePart {
	public x: number;
	public y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

const snakeParts: SnakePart[] = [];
let tailLength: number = 0;

const resetGame: () => void = () => {
	score = 0;
	snakeParts.splice(0, snakeParts.length);
	tailLength = 0;
	isGameFinished = false;
};

const changeSnakePositon = (): void => {
	head[0] += velocity[0];
	head[1] += velocity[1];
};

const clearScreen = (): void => {
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, w, h);
};

const appleCollision = (): void => {
	if (apple[0] == head[0] && apple[1] == head[1]) {
		apple[0] = Math.floor(Math.random() * (tileCount - 8) + 3);
		apple[1] = Math.floor(Math.random() * (tileCount - 8) + 3);
		tailLength++;
		score++;
	}
};

const drawScore = (): void => {
	ctx.fillStyle = "#fff";
	ctx.font = "36px verdana";
	ctx.fillText("Score : " + score, w - 150, 50);
};

const drawGameOver = (): void => {
	ctx.fillStyle = "blue";
	ctx.font = "50px verdana";
	ctx.fillText("you lose", w / 2, h / 2);
};

const drawApple = (): void => {
	ctx.fillStyle = "red";
	ctx.fillRect(apple[0] * tileCount, apple[1] * tileCount, tileSize, tileSize);
};

const drawSnake = (): void => {
	ctx.fillStyle = "#ccc";
	if (head[0] < 0) {
		head[0] = tileCount - 5;
	}
	if (head[0] > tileCount - 5) {
		head[0] = 0;
	}
	if (head[1] < 0) {
		head[1] = tileCount - 5;
	}
	if (head[1] > tileCount - 5) {
		head[1] = 0;
	}
	for (const part of snakeParts) {
		ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
	}
	snakeParts.push(new SnakePart(head[0], head[1]));
	if (snakeParts.length > tailLength) {
		snakeParts.shift();
	}
	ctx.fillStyle = "#fff";
	ctx.fillRect(head[0] * tileCount, head[1] * tileCount, tileSize, tileSize);
};

const isGameOver = (): void => {
	for (const part of snakeParts) {
		if (head[0] == part.x && head[1] == part.y) {
			isGameFinished = true;
			return;
		}
	}
	isGameFinished = false;
	return;
};

const drawGame = (delta: number): void => {
	if (delta - start < speed) {
	} else {
		changeSnakePositon();
		isGameOver();
		if (isGameFinished) {
			drawGameOver();
			return;
		}
		clearScreen();
		appleCollision();
		drawApple();
		drawSnake();
		drawScore();
		start = delta;
	}
	requestAnimationFrame(drawGame);
};

resetBtn.addEventListener("click", (e) => {
	e.preventDefault();
	resetGame();
	requestAnimationFrame(drawGame);
});

requestAnimationFrame(drawGame);
