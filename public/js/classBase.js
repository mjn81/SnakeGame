"use strict";
const scoreBoard = document.querySelector("#score");
const resetBtn = document.querySelector("#reset");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const TILE_COUNT = 30, TILE_SIZE = 25;
let velocity = [0, 0], score = 0, tailLength = 0;
var KEYS;
(function (KEYS) {
    KEYS["UP"] = "ArrowUp";
    KEYS["DOWN"] = "ArrowDown";
    KEYS["LEFT"] = "ArrowLeft";
    KEYS["RIGHT"] = "ArrowRight";
    KEYS["SPACE"] = "Space";
})(KEYS || (KEYS = {}));
var COLORS;
(function (COLORS) {
    COLORS["SHEAD"] = "#FFF";
    COLORS["SBODY"] = "##E1E1E1";
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
        this.drawSnake = () => {
            ctx.fillStyle = this.head.color;
            ctx.shadowColor = "rgba(255,255,255,.3 )";
            ctx.shadowBlur = 20;
            ctx.fillRect(this.head.x * TILE_SIZE, this.head.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            ctx.shadowBlur = 0;
        };
        this.head = new Tile(2, 2, COLORS.SHEAD);
        this.body = [];
    }
}
window.addEventListener("keydown", (e) => {
    switch (e.code) {
        case KEYS.DOWN:
            break;
    }
});
const snake = new Snake();
class Game {
    constructor() {
        this.drawGame = (deltaTime) => {
            snake.drawSnake();
            requestAnimationFrame(this.drawGame);
        };
    }
}
const game = new Game();
requestAnimationFrame(game.drawGame);
