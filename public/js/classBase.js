"use strict";
const scoreBoard = document.querySelector("#score");
const resetBtn = document.querySelector("#reset");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const TILE_COUNT = 30, TILE_SIZE = 25, WIDTH = canvas.width, HEIGHT = canvas.height, SHADOW_SIZE = 20;
var KEYS;
(function (KEYS) {
    KEYS["UP"] = "ArrowUp";
    KEYS["DOWN"] = "ArrowDown";
    KEYS["LEFT"] = "ArrowLeft";
    KEYS["RIGHT"] = "ArrowRight";
    KEYS["SPACE"] = "Space";
})(KEYS || (KEYS = {}));
let velocity = [0, 0, null], deltaTime = 0, speed = 100, score = 0, tailLength = 0, isGameOver = false;
var COLORS;
(function (COLORS) {
    COLORS["SHEAD"] = "#FFF";
    COLORS["SHEAD_SHADOW"] = "rgba(255,255,255,0.3 )";
    COLORS["SBODY"] = "#E1E1E1";
    COLORS["TILE_BORDER"] = "#222738";
    COLORS["TILE"] = "#181825";
    COLORS["APPLE"] = "red";
    // TODO: find mild shadow color
    COLORS["APPLE_SHADOW"] = "red";
})(COLORS || (COLORS = {}));
class Tile {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
}
class Snake {
    constructor() {
        this.changeSnakePositon = () => {
            const h = this.head;
            if (h.x >= TILE_COUNT) {
                h.x = 0;
            }
            else if (h.y >= TILE_COUNT) {
                h.y = 0;
            }
            else if (h.x < 0) {
                h.x = TILE_COUNT;
            }
            else if (h.y < 0) {
                h.y = TILE_COUNT;
            }
            h.x += velocity[0];
            h.y += velocity[1];
        };
        this.checkSnakeCollection = () => {
            const h = this.head;
            for (let part of this.body) {
                if (part.x == h.x && part.y == h.y) {
                    isGameOver = true;
                }
            }
        };
        this.drawSnake = () => {
            const h = this.head;
            ctx.fillStyle = COLORS.SBODY;
            for (let part of this.body) {
                ctx.fillRect(part.x * TILE_SIZE, part.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
            this.body.push(new Tile(h.x, h.y, null));
            while (this.body.length > tailLength) {
                this.body.shift();
            }
            ctx.fillStyle = h.color;
            ctx.shadowColor = COLORS.SHEAD_SHADOW;
            ctx.shadowBlur = SHADOW_SIZE;
            ctx.fillRect(h.x * TILE_SIZE, h.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            ctx.shadowBlur = 0;
        };
        this.head = new Tile(2, 2, COLORS.SHEAD);
        this.body = [];
    }
}
const snake = new Snake();
class Apple {
    constructor() {
        // TODO: create random colors for apple
        this.randomGenerator = () => {
            const xPos = Math.floor(Math.random() * TILE_COUNT), yPos = Math.floor(Math.random() * TILE_COUNT);
            return new Tile(xPos, yPos, COLORS.APPLE);
        };
        this.drawApple = () => {
            ctx.shadowColor = COLORS.APPLE_SHADOW;
            ctx.shadowBlur = SHADOW_SIZE;
            ctx.fillStyle = this.position.color;
            ctx.fillRect(this.position.x * TILE_SIZE, this.position.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            ctx.shadowBlur = 0;
        };
        this.checkAppleCollision = () => {
            if (this.position.x == snake.head.x && this.position.y == snake.head.y) {
                this.position = this.randomGenerator();
                tailLength++;
                score++;
                if (score < 10) {
                    scoreBoard.textContent = "0" + score;
                }
                else {
                    scoreBoard.textContent = score.toString();
                }
            }
        };
        this.position = this.randomGenerator();
    }
}
const apple = new Apple();
class Game {
    constructor() {
        this.drawTileMap = () => {
            ctx.strokeStyle = COLORS.TILE_BORDER;
            ctx.fillStyle = COLORS.TILE;
            for (let i = 0; i < TILE_COUNT; i++) {
                for (let j = 0; j < TILE_COUNT; j++) {
                    ctx.fillRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    ctx.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        };
        this.drawGameOver = () => {
            ctx.fillStyle = COLORS.TILE;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.fillStyle = COLORS.TILE_BORDER;
            ctx.font = "italic bold 50px Poppins";
            ctx.fillText("Game Over", WIDTH / 2 - 145, HEIGHT / 2 + 20);
        };
        this.drawGame = (time) => {
            if (time - deltaTime < speed) {
            }
            else {
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
}
const game = new Game();
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
resetBtn.addEventListener("click", () => {
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
