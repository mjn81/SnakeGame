"use strict";
const canvas = document.querySelector("#canvas");
const resetBtn = document.querySelector("#resetBtn");
const ctx = (canvas.getContext("2d"));
const w = canvas.width;
const h = canvas.height;
const speed = 150;
const tileCount = 30;
const tileSize = w / tileCount;
let start = 0;
const head = [5, 5];
const apple = [
    Math.floor(Math.random() * (tileCount - 8) + 3),
    Math.floor(Math.random() * (tileCount - 8) + 3),
];
let velocity = [0, 0];
let direction = null;
let score = 0;
let isGameFinished = false;
window.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "ArrowUp" /* UP */:
            if (direction === "ArrowDown" /* DOWN */) {
                return;
            }
            direction = "ArrowUp" /* UP */;
            velocity = [0, -1];
            break;
        case "ArrowDown" /* DOWN */:
            if (direction === "ArrowUp" /* UP */) {
                return;
            }
            direction = "ArrowDown" /* DOWN */;
            velocity = [0, 1];
            break;
        case "ArrowLeft" /* LEFT */:
            if (direction === "ArrowRight" /* RIGHT */) {
                return;
            }
            direction = "ArrowLeft" /* LEFT */;
            velocity = [-1, 0];
            break;
        case "ArrowRight" /* RIGHT */:
            if (direction === "ArrowLeft" /* LEFT */) {
                return;
            }
            direction = "ArrowRight" /* RIGHT */;
            velocity = [1, 0];
            break;
    }
});
class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
const snakeParts = [];
let tailLength = 0;
const resetGame = () => {
    score = 0;
    snakeParts.splice(0, snakeParts.length);
    tailLength = 0;
    isGameFinished = false;
};
const changeSnakePositon = () => {
    head[0] += velocity[0];
    head[1] += velocity[1];
};
const clearScreen = () => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
};
const appleCollision = () => {
    if (apple[0] == head[0] && apple[1] == head[1]) {
        apple[0] = Math.floor(Math.random() * (tileCount - 8) + 3);
        apple[1] = Math.floor(Math.random() * (tileCount - 8) + 3);
        tailLength++;
        score++;
    }
};
const drawScore = () => {
    ctx.fillStyle = "#fff";
    ctx.font = "36px verdana";
    ctx.fillText("Score : " + score, w - 150, 50);
};
const drawGameOver = () => {
    ctx.fillStyle = "blue";
    ctx.font = "50px verdana";
    ctx.fillText("you lose", w / 2, h / 2);
};
const drawApple = () => {
    ctx.fillStyle = "red";
    ctx.fillRect(apple[0] * tileCount, apple[1] * tileCount, tileSize, tileSize);
};
const drawSnake = () => {
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
const isGameOver = () => {
    for (const part of snakeParts) {
        if (head[0] == part.x && head[1] == part.y) {
            isGameFinished = true;
            return;
        }
    }
    isGameFinished = false;
    return;
};
const drawGame = (delta) => {
    if (delta - start < speed) {
    }
    else {
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
