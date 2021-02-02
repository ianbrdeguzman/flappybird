// create canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// make canvas responsive
const resizeCanvas = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}

// add event listener when screen resize
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let isPressed = false;
let gamespeed = 2;
let frame = 0;
let score = 0;

const obstacleArray = [];

// create Bird class
class Bird {
    constructor() {
        this.x = canvas.width / 4;
        this.y = canvas.height / 2;
        this.vy = 0;
        this.width = 20;
        this.height = 20;
        this.weight = 1;
    }
    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    update() {
        if (this.y > canvas.height - this.height) {
            this.y = canvas.height - this.height ;
            this.vy = 0;
        } else {
            this.vy += this.weight;
            this.vy *= 0.8;
            this.y += this.vy;
        }
        if (this.y < 0 + this.height ) {
            this.y = 0 + this.height;
            this.vy = 0;
        }
        if (isPressed) {
            this.flap();
        }
        this.draw();
    }
    flap() {
        this.vy -= 2;
    }
}

const bird = new Bird();

// create Obstacle class
class Obstacle {
    constructor() {
        this.top = (Math.random() * canvas.height / 2) + 20;
        this.bottom = (canvas.height - this.top) - 150;
        this.x = canvas.width;
        this.width = 50;
        this.color = 'green';
        this.counted = false;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0, this.width, this.top)
        ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom)
    }
    update() {
        this.x -= gamespeed;
        if (!this.counted && this.x + this.width < bird.x) {
            score++;
            this.counted = true;
        }
        this.draw();
    }
}


// function to handle obstacle
function handleObstacle() {
    if (frame % 180  === 0) {
        obstacleArray.unshift(new Obstacle);
    }

    for (let i = 0; i < obstacleArray.length; i++) {
        obstacleArray[i].update();
    }

    if (obstacleArray.length > 10) {
        obstacleArray.pop(obstacleArray[0]);
    }
}

// create new image to be used on collision
const bang = new Image();
bang.src = './assets/bang.png'

// function to handle collision
function handleCollisions() {
    for (let i = 0; i < obstacleArray.length; i++) {
        if (bird.x < obstacleArray[i].x + obstacleArray[i].width &&
            bird.x + bird.width > obstacleArray[i].x &&
            (bird.y < 0 + obstacleArray[i].top && bird.y + bird.height > 0 ||
            bird.y > canvas.height - obstacleArray[i].bottom &&
            bird.y + bird.height < canvas.height)) {
                ctx.drawImage(bang, bird.x, bird.y, 50, 50);
                ctx.font = '1rem Arial';
                ctx.fillStyle = '#272727';
                ctx.fillText(`Game Over! Your score is ${score}`, (canvas.width / 4), canvas.height /2, canvas.width)
                return true;
            }
        if (bird.y + bird.height >= canvas.height) {
            ctx.drawImage(bang, bird.x, bird.y, 50, 50);
            ctx.font = '1rem Arial';
            ctx.fillStyle = '#272727';
            ctx.fillText(`Game Over! Your score is ${score}`, (canvas.width / 4), canvas.height /2, canvas.width)
            return true;
        }
    }
}

// show score on canvas
function showScore() {
    ctx.font = '2rem Arial';
    ctx.strokeText(score, 20, 50);
    ctx.fillText(score, 20, 50);
}

// main animation loop
function animate() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    handleObstacle();
    handleCollisions();
    if(handleCollisions()) return;
    if(bird.update()) return;
    showScore();
    frame++;
    requestAnimationFrame(animate); // recursion
}

animate();

// space key event listener on keydown
window.addEventListener('keydown', (e) => {
    if(e.code === 'Space'){
        isPressed = true;
    }
});

// space key event listener on keyup
window.addEventListener('keyup', (e) => {
    if(e.code === 'Space') {
        isPressed = false;
    }
});



