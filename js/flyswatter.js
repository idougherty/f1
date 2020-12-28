let canvas = document.getElementById("paper");
let c = canvas.getContext("2d");

class Fly {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.timer = 0;

        let flySprite = new Image(357/8, 351/8);
        flySprite.src = "assets/fly.png";
        this.sprite = flySprite;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.timer--;

        if(this.timer <= 0) {
            this.vx = Math.random() * 16 - 8;
            this.vy = Math.random() * 16 - 8;
            this.timer = 10;
        }

        this.collision();
    }

    collision() {
        if(this.x < 0) {
            this.x = 0;
        }
        if(this.y < 0) {
            this.y = 0;
        }
        if(this.x + this.sprite.width > canvas.width) {
            this.x = canvas.width - this.sprite.width;
        }
        if(this.y + this.sprite.height > canvas.height) {
            this.y = canvas.height - this.sprite.height;
        }
    }

    draw() {
        c.drawImage(this.sprite, this.x, this.y, this.sprite.width, this.sprite.height);
    }
}

class FlySwatter {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.down = false;

        let swatSprite = new Image();
        swatSprite.src = "assets/flyswatter.webp";
        this.sprite = swatSprite;
    }

    update() {

    }
    
    draw() {
        c.drawImage(this.sprite, this.x, this.y, this.sprite.width, this.sprite.height);
    }
}

class FlyRunner {
    constructor() {
        this.flies = [];
        this.swatter = new FlySwatter();

        for(let i = 0; i < 10; i++) {
            this.flies.push(new Fly(Math.random() * canvas.width, Math.random() * canvas.height));
        }
    }

    update() {
        for(let fly of this.flies) {
            fly.update();
        }
        this.swatter.update();
    }
    
    draw() {
        for(let fly of this.flies) {
            fly.draw();
        }
        this.swatter.draw();
    }
}

let gameRunner = new FlyRunner();

function gameLoop() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#FAFF70";
    c.fillRect(0, 0, canvas.width, canvas.height);

    gameRunner.update();
    gameRunner.draw();

    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);