let canvas = document.getElementById("paper");
let c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;
c.mozImageSmoothingEnabled = false;

class Mouse {
    x = 0;
    y = 0;
    left = false;
    right = false;
}

function updateState(e) {
    if(e.buttons == 3) {
        mouse.left = true;
        mouse.right = true;
    } else if(e.buttons == 2) {
        mouse.left = false;
        mouse.right = true;
    } else if(e.buttons == 1) {
        mouse.left = true;
        mouse.right = false;
    } else {
        mouse.left = false;
        mouse.right = false;
    }
}

function updatePos(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

let mouse = new Mouse();

canvas.addEventListener("mousemove", updatePos);
canvas.addEventListener("mousedown", updateState);
canvas.addEventListener("mouseup", updateState);

class Decal {
    constructor(src, x, y, scale = 1) {
        let sprite = new Image();
        sprite.src = src;
        this.scale = 1;
        this.sprite = sprite;
        this.loaded = false;
        this.scale = scale;
        this.x = x;
        this.y = y;
    }

    draw() {
        if(this.loaded) {
            c.globalAlpha = .7;
            c.drawImage(this.sprite, this.x, this.y, this.sprite.width, this.sprite.height);
            c.globalAlpha = 1;
        } else {
            if(this.sprite.width != 0) {
                this.sprite.width *= this.scale;
                this.sprite.height *= this.scale;
                this.x -= this.sprite.width/2;
                this.y -= this.sprite.height/2;
                this.loaded = true;
            }
        }
    }
}

class Fly {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.timer = 0;
        this.alive = true;

        let flySpriteAlive = new Image(30, 30);
        flySpriteAlive.src = "assets/fly.png";
        let flySpriteDead = new Image(30, 30);
        flySpriteDead.src = "assets/flydead.png";
        
        this.sprite = flySpriteAlive;
        this.spriteDead = flySpriteDead;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.timer--;

        if(this.alive) {
            if(this.timer <= 0) {
                this.vx = Math.random() * 20 - 10;
                this.vy = Math.random() * 20 - 10;
                this.timer = Math.random() * 10 + 5;
            }
            
            this.collision();
        } else {
            this.vy += .6;
            this.vx *= .97;
            this.vy *= .97;
        }
        
    }

    collision() {
        if(this.x < 0) {
            this.x = 0;
            this.vx *= -1;
        }
        if(this.y < 0) {
            this.y = 0;
            this.vy *= -1;
        }
        if(this.x + this.sprite.width > canvas.width) {
            this.x = canvas.width - this.sprite.width;
            this.vx *= -1;
        }
        if(this.y + this.sprite.height > canvas.height) {
            this.y = canvas.height - this.sprite.height;
            this.vy *= -1;
        }
    }

    draw() {
        if(this.alive) {
            c.drawImage(this.sprite, this.x, this.y, this.sprite.width, this.sprite.height);
        } else {
            c.drawImage(this.spriteDead, this.x, this.y, this.spriteDead.width, this.spriteDead.height);
        }
    }

    die() {
        this.alive = false;
        this.vx *= .5;
        this.vy = -2;
    }
}

class FlySwatter {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.visible = false;
        this.downTimer = 0;
        this.coolDown = 0;
        this.alive = false;

        let swatSprite = new Image(90, 270);
        swatSprite.src = "assets/flyswatter.png";
        this.sprite = swatSprite;

    }

    update() {
        if(this.coolDown < 0 && mouse.left) {
            this.down = true;
            this.downTimer = 7;
            this.coolDown = 10;

            this.x = mouse.x;
            this.y = mouse.y;
        }

        if(this.down) {
            if(this.downTimer < 0) {
                this.down = false;
            }
            this.downTimer--;
        } else {
            this.coolDown--;
        }
    }
    
    draw() {
        if(this.down) {
            // c.strokeStyle = "red";
            // c.strokeRect(this.x - 40, this.y - 50, 80, 80);
            c.drawImage(this.sprite, this.x - this.sprite.width/2, this.y - 50, this.sprite.width, this.sprite.height);
        }
    }

    collision(fly) {
        if(this.down) {
            return (fly.x < this.x + 40 && fly.y < this.y + 30 && fly.x + fly.sprite.width > this.x - 40 && fly.y + fly.sprite.height > this.y - 50);
        }
    }
}

class FlyRunner {
    constructor() {
        this.flies = [];
        this.decals = [];
        this.swatter = new FlySwatter();
        this.gameOver = false;
        this.win = null;

        for(let i = 0; i < 20; i++) {
            this.flies.push(new Fly(Math.random() * canvas.width, Math.random() * canvas.height));
        }
    }

    update() {
        this.swatter.update();
        for(let i = this.flies.length - 1; i >= 0; i--) {
            this.flies[i].update();
            
            if(this.flies[i].alive && this.swatter.collision(this.flies[i])) {
                this.flies[i].die();

                const decalX = this.flies[i].x + this.flies[i].sprite.width/2;
                const decalY = this.flies[i].y + this.flies[i].sprite.height/2;
                const decalScale = Math.random()*.1 + .1;
                this.decals.push(new Decal("assets/blood.png", decalX, decalY, decalScale));
            }

            if(this.flies[i].y > canvas.height) {
                this.flies.splice(i, 1);
            }
        }

        if(this.flies.length == 0) {
            this.gameOver = true;
            this.win = true;
        }
    }
    
    draw() {
        for(let decal of this.decals) {
            decal.draw();
        }
        for(let fly of this.flies) {
            fly.draw();
        }
        if(!this.gameOver) {
            this.swatter.draw();
        } else {
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillStyle = "white";
            c.font = "30px Courier New";
            c.fillText("you done did it", canvas.width/2, canvas.height/2);
        }
    }
}

let gameRunner = new FlyRunner();

setInterval(function() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#F0CF85";
    c.fillRect(0, 0, canvas.width, canvas.height);

    gameRunner.update();
    gameRunner.draw();
}, 15);