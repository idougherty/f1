let canvas = document.getElementById("paper");
let c = canvas.getContext("2d");

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

// class Sprite {
//     constructor(img, width, height) {
//         this.img = img;
//         this.width = width;
//         this.height = height;
//     }
// }

class GameObject {
    constructor(sprite, x, y, clickable = false, active = false) {
        this.clickable = clickable;
        this.active = active;
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.visible = true;
    }

    update() {
        if(this.clickable) {
            if(this.clicked()) {
                this.active = true;
            }
        }
    }

    draw() {
        if(this.visible) {
            c.drawImage(this.sprite, this.x, this.y, this.sprite.width, this.sprite.height);
        }
    }

    clicked() {
        if(!mouse.left) { return false; }
        return (mouse.x < this.x + this.sprite.width && mouse.y < this.y + this.sprite.height && mouse.x > this.x && mouse.y > this.y);
    }
}

class CupSwapper {
    constructor() {
        let cupSprite = new Image(445/4, 428/4);
        cupSprite.src = "cup.png";
        this.cups = [new GameObject(cupSprite, canvas.width * 1/4 - cupSprite.width/2, canvas.height/2 - cupSprite.height/2 - 200, false),
                      new GameObject(cupSprite, canvas.width * 2/4 - cupSprite.width/2, canvas.height/2 - cupSprite.height/2 - 200, false),
                      new GameObject(cupSprite, canvas.width * 3/4 - cupSprite.width/2, canvas.height/2 - cupSprite.height/2 - 200, false)];
        
        this.swaps = 25;
        this.speed = 1;
        this.curAngle = 0;

        let tireSprite = new Image(445/4, 428/4);
        tireSprite.src = "tire.png";
        this.tire = new GameObject(tireSprite, canvas.width * 2/4 - tireSprite.width/2, canvas.height/2 - tireSprite.height/2, false);

        const idx = Math.floor(Math.random() * this.cups.length);
        this.activeCups = [idx, (idx + 1) % this.cups.length];
        this.introFrames = 200;
    }

    update() {
        if(this.introFrames > 0) {
            for(let cup of this.cups) {
                cup.y++;
            }
            this.introFrames--;
            if(this.introFrames <= 0) {
                this.tire.visible = false;
            }
        } else {
            if(this.swaps > 0) {
                const theta = Math.PI / (100 / this.speed + 3) * this.direction;
                if(this.curAngle + theta < Math.PI && this.curAngle - theta > -Math.PI) {
                    this.rotateCups(this.cups[this.activeCups[0]], this.cups[this.activeCups[1]], theta);
                    this.curAngle += theta;
                } else {
                    this.swaps -= 1;
                    this.curAngle = 0;
                    this.speed = (Math.abs(this.speed) + .5);
                    this.direction = Math.sign(Math.random() - .5);
                    const idx = Math.floor(Math.random() * this.cups.length);
                    this.activeCups = [idx, (idx + 1) % this.cups.length];

                    if(this.swaps <= 0) {
                        this.tire.x = this.cups[1].x;
                        this.tire.y = this.cups[1].y;
                        this.tire.visible = true
                        this.cups[0].clickable = true;
                        this.cups[1].clickable = true;
                        this.cups[2].clickable = true;
                    }
                }
            } else {
                for(let cup of this.cups) {
                    cup.update();
                    if(cup.active) {
                        for(let cup of this.cups) {
                            cup.clickable = false;
                        }
                        cup.visible = false;
                    }
                }
            }
        }
    }

    rotateCups(cup1, cup2, theta) {
        const pivotX = (cup1.x + cup2.x) / 2;
        const pivotY = (cup1.y + cup2.y) / 2;

        const nx = Math.cos(theta) * (pivotX - cup1.x) - Math.sin(theta) * (pivotY - cup1.y);
        const ny = Math.cos(theta) * (pivotY - cup1.y) + Math.sin(theta) * (pivotX - cup1.x);
        
        cup1.x = pivotX - nx;
        cup2.x = pivotX + nx;
        cup1.y = pivotY - ny;
        cup2.y = pivotY + ny;
    }

    draw() {
        this.tire.draw();
        for(let cup of this.cups) {
            cup.draw();
        }
    }
}

let mouse = new Mouse();
let gameRunner = new CupSwapper(); 

canvas.addEventListener("mousemove", updatePos);
canvas.addEventListener("mousedown", updateState);
canvas.addEventListener("mouseup", updateState);

function gameLoop() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#dffaf3";
    c.fillRect(0, 0, canvas.width, canvas.height);

    gameRunner.update();
    gameRunner.draw();

    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);