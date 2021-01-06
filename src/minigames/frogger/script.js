let canvas = document.getElementById("paper");
let c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;
c.mozImageSmoothingEnabled = false;

class Car {
    constructor(x, y, d) {
        this.x = x;
        this.y = y;
        this.d = d;

        this.vx = 0;
        this.vy = 0;
        this.speed = 0;

        this.width = 60;
        this.height = 30;        
    }

    update(key) {
        const realSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

        if(key.left && !key.right) {
            this.d -= Math.min(.02 * realSpeed, .07);
        } else if(key.right && !key.left) {
            this.d += Math.min(.02 * realSpeed, .07);
        }

        if(key.up && !key.down && this.speed < 1.5) {
            this.speed += .4;
        } else if(key.down && !key.up && this.speed > -1.5) {
            this.speed -= .4;
        } else {
            this.speed *= .8;
        }
        this.vx *= .7;
        this.vy *= .7;

        this.vx += Math.cos(this.d) * this.speed;
        this.vy += Math.sin(this.d) * this.speed;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        c.fillStyle = "red";
        c.translate(this.x, this.y);
        c.rotate(this.d);
        c.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        c.rotate(-this.d);
        c.translate(-this.x, -this.y);
    }
}

class Road {
    constructor() {
        this.x = canvas.width/2 - 320;
        this.y = 0;

        let sprite = new Image(640, 480);
        sprite.src = "assets/road.png";
        this.sprite = sprite;
    }

    update() {
        // this.y += 1;
    }

    draw(offset) {
        const y1 = - Math.floor(offset/canvas.height) * canvas.height;
        const y2 = y1 - canvas.height;
        c.drawImage(this.sprite, this.x, y1, this.sprite.width, this.sprite.height);
        c.drawImage(this.sprite, this.x, y2, this.sprite.width, this.sprite.height);
    }
}

class Frog {
    constructor(x, y, dir, jumpTimer, vx) {
        this.y = y;
        this.x = x;
        this.dir = dir;
        this.jumpTimer = jumpTimer;
        this.vx = vx;

        let sprite = new Image(64, 64);
        sprite.src = "assets/road.png";
        this.sprite = sprite;
    }

    update(offset) {
        this.jumpTimer--;

        if(this.jumpTimer < 0) {
            this.vx = this.dir * 10;
            this.jumpTimer = 70;
        }

        this.vx *= .92;

        if(Math.abs(this.vx) < 1) {
            this.vx = 0;
        }

        this.x += this.vx;

        return Math.abs(this.x - canvas.width/2 + this.sprite.width/2) > canvas.width/2 + this.sprite.width * 2 || this.y > offset + canvas.height; 
    }

    draw() {
        c.fillStyle = "green";
        c.fillRect(this.x, this.y, this.sprite.width, this.sprite.height);
    }
}

class FrogHandler {
    constructor() {
        this.key = {
            left: false,
            right: false,
            up: false,
            down: false,
        };

        this.car = new Car(canvas.width/2, canvas.height/2, -Math.PI/2);
        this.road = new Road();
        this.frogs = [];
        this.frogAmt = 8;

        this.offset = 0;
    }

    update() {
        const offsetTarget = Math.max(-this.car.y + canvas.height * .3, this.offset + 30);
        this.offset += (offsetTarget - this.offset) / 20;

        for(const [index, frog] of this.frogs.entries()) {
            if(frog.update(this.offset)) {
                this.frogs.splice(index, 1);
            }
        }

        if(this.frogs.length < this.frogAmt) {
            let fy = -this.offset + (canvas.height / 2 - Math.random() * canvas.height);
            fy = Math.floor(fy / 100) * 100;
            
            let fdir = Math.sign(Math.random() - .5);
            let fjumpTimer = 70;
            let fvx = 0;
            let fx = null;
            
            if(fy + 64 > -this.offset) {
                fx = canvas.width / 2 - (fdir * (canvas.width/2 + 64)) - 32;
            } else {
                fx = canvas.width / 2 - Math.random() * (fdir * (canvas.width/2 + 64)) - 32;
            }
            
            for(const frog of this.frogs) {
                if(frog.y == fy) {
                    fdir = frog.dir;

                    if(fy + 64 > -this.offset) {
                        if(frog.x > 0 || frog.x + 64 < canvas.width) {
                            continue;
                        }
                    }
                    
                    fx = frog.x - fdir * 100;
                    fjumpTimer = frog.jumpTimer + 10;
                    fvx = frog.vx;
                    break;
                }
            }

            
            this.frogs.push(new Frog(fx, fy, fdir, fjumpTimer, fvx));
        }

        if(this.frogAmt < 15) {
            this.frogAmt += .01;
        }

        this.car.update(this.key);
        this.road.update();
    }

    draw() {
        c.translate(0, this.offset);
        
        this.road.draw(this.offset);
        
        this.car.draw();
        
        for(const frog of this.frogs) {
            frog.draw();
        }
        
        c.translate(0, -this.offset);
    }
}

document.addEventListener("keydown", function(e) {
    switch(e.keyCode) {
        case 65:
        case 37:
            gameHandler.key.left = true;
            break;
        case 87:
        case 38:
            gameHandler.key.up = true;
            break;
        case 68:
        case 39:
            gameHandler.key.right = true;
            break;
        case 83:
        case 40:
            gameHandler.key.down = true;
            break;
        default:
    }
});

document.addEventListener("keyup", function(e) {
    switch(e.keyCode) {
        case 65:
        case 37:
            gameHandler.key.left = false;
            break;
        case 87:
        case 38:
            gameHandler.key.up = false;
            break;
        case 68:
        case 39:
            gameHandler.key.right = false;
            break;
        case 83:
        case 40:
            gameHandler.key.down = false;
            break;
        default:
    }
});

let gameHandler = new FrogHandler();

setInterval(function() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#C0E5C8";
    c.fillRect(0, 0, canvas.width, canvas.height);

    gameHandler.update();
    
    gameHandler.draw();
}, 15);