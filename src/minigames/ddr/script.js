let canvas = document.getElementById("paper");
let c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;
c.mozImageSmoothingEnabled = false;

class Arrow {
    static WIDTH = 80;
    static HEIGHT = 80;

    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.speed = 4;
        this.dir = dir;

        let spriteLeft = new Image(Arrow.WIDTH, Arrow.HEIGHT);
        spriteLeft.src = "assets/arrow-left.png";

        let spriteUp = new Image(Arrow.WIDTH, Arrow.HEIGHT);
        spriteUp.src = "assets/arrow-up.png";
        
        let spriteRight = new Image(Arrow.WIDTH, Arrow.HEIGHT);
        spriteRight.src = "assets/arrow-right.png";
        
        let spriteDown = new Image(Arrow.WIDTH, Arrow.HEIGHT);
        spriteDown.src = "assets/arrow-down.png";

        this.sprite = {
            left: spriteLeft,
            up: spriteUp,
            right: spriteRight,
            down: spriteDown,
        }
    }

    update() {
        // this.speed += .1;
        this.y += this.speed;
    }

    checkBounds() {
        return this.y > canvas.height;
    }

    draw() {
        let sprite = null;

        switch(this.dir) {
            case "left":
                sprite = this.sprite.left;
                break;
            case "up":
                sprite = this.sprite.up;
                break;
            case "right":
                sprite = this.sprite.right;
                break;
            case "down":
                sprite = this.sprite.down;
                break;
            default:
        }

        c.drawImage(sprite, this.x, this.y, Arrow.WIDTH, Arrow.HEIGHT);
    }
}

class Target {
    static WIDTH = 88;
    static HEIGHT = 88;

    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.arrows = [];
        this.timer = 0;
        this.keyDown = false;
        
        this.sprite = new Image(Target.WIDTH, Target.HEIGHT);
        this.sprite.src = "assets/target-" + dir + ".png";
    }

    update() {
        if(this.keyDown && this.timer > 15) {
            this.timer = 0;

            if(this.arrows.length == 0) return;

            const tolerance = 10;

            if(this.arrows[0].y + tolerance > this.y && this.arrows[0].y + Arrow.HEIGHT < this.y + Target.HEIGHT + tolerance) {
                this.arrows.splice(0, 1);
            }
        }

        this.timer++;
    }

    draw() {
        for(const arrow of this.arrows) {
            arrow.draw();
        }

        c.globalAlpha = this.timer/15;
        c.drawImage(this.sprite, this.x, this.y, Target.WIDTH, Target.HEIGHT);
        c.globalAlpha = 1;
    }
}

class DDRHandler {
    constructor() {
        this.arrowTimer = 0;
        
        this.target = {
            left: null,
            up: null,
            right: null,
            down: null,
        };

        const spacing = 20;
        const border = (Target.WIDTH - Arrow.WIDTH) / 2;
        let y = canvas.height * .75;
        
        let x = canvas.width / 2 - spacing * 1.5 - Arrow.WIDTH * 2 - border;
        let dir = "left";
        this.target.left = new Target(x, y, dir);

        x = canvas.width / 2 - spacing * .5 - Arrow.WIDTH - border;
        dir = "down";
        this.target.down = new Target(x, y, dir);

        x = canvas.width / 2 + spacing * .5 - border;
        dir = "up";
        this.target.up = new Target(x, y, dir);

        x = canvas.width / 2 + spacing * 1.5 + Arrow.WIDTH - border;
        dir = "right";
        this.target.right = new Target(x, y, dir);
    }

    update() {
        for(const [idx, target] of Object.entries(this.target)) {
            for(let i = target.arrows.length - 1; i >= 0; i--) {
                target.arrows[i].update();
    
                if(target.arrows[i].checkBounds()) {
                    target.arrows.splice(i, 1);
                }
            }
        }

        this.target.left.update();
        this.target.up.update();
        this.target.right.update();
        this.target.down.update();

        if(this.arrowTimer > 40) {
            this.spawnArrows();

            this.arrowTimer = 0
        }

        this.arrowTimer++;
    }

    spawnArrows() {
        const spacing = 20;

        if(Math.random() < .25) {
            const x = canvas.width / 2 - spacing * 1.5 - Arrow.WIDTH * 2;
            const y = -Arrow.HEIGHT;
            const dir = "left";

            this.target.left.arrows.push(new Arrow(x, y, dir));
        }

        if(Math.random() < .25) {
            const x = canvas.width / 2 + spacing * 1.5 + Arrow.WIDTH;
            const y = -Arrow.HEIGHT;
            const dir = "right";

            this.target.right.arrows.push(new Arrow(x, y, dir));
        }
        
        if(Math.random() < .25) {
            const x = canvas.width / 2 + spacing * .5;
            const y = -Arrow.HEIGHT;
            const dir = "up";

            this.target.up.arrows.push(new Arrow(x, y, dir));
        } else if(Math.random() < .33) {
            const x = canvas.width / 2 - spacing * .5 - Arrow.WIDTH;
            const y = -Arrow.HEIGHT;
            const dir = "down";

            this.target.down.arrows.push(new Arrow(x, y, dir));
        }
    }

    draw() {
        this.target.left.draw();
        this.target.up.draw();
        this.target.right.draw();
        this.target.down.draw();
    }
}

let gameHandler = new DDRHandler();

document.addEventListener("keydown", function(e) {
    switch(e.keyCode) {
        case 65:
        case 37:
            gameHandler.target.left.keyDown = true;
            break;
        case 87:
        case 38:
            gameHandler.target.up.keyDown = true;
            break;
        case 68:
        case 39:
            gameHandler.target.right.keyDown = true;
            break;
        case 83:
        case 40:
            gameHandler.target.down.keyDown = true;
            break;
        default:
    }
});

document.addEventListener("keyup", function(e) {
    switch(e.keyCode) {
        case 65:
        case 37:
            gameHandler.target.left.keyDown = false;
            break;
        case 87:
        case 38:
            gameHandler.target.up.keyDown = false;
            break;
        case 68:
        case 39:
            gameHandler.target.right.keyDown = false;
            break;
        case 83:
        case 40:
            gameHandler.target.down.keyDown = false;
            break;
        default:
    }
});

setInterval(function() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#4B3F72";
    c.fillRect(0, 0, canvas.width, canvas.height);

    gameHandler.update();
    gameHandler.draw();
}, 15);