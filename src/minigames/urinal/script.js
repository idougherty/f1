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

let mouse = new Mouse();

canvas.addEventListener("mousemove", updatePos);
canvas.addEventListener("mousedown", updateState);
canvas.addEventListener("mouseup", updateState);


class Urinal {
    constructor (y, speed){
        this.x = 0;
        this.y = y;
        this.vx = 10;
        this.empty = true;
        if(speed == 2){
            this.vx = 20;
        }
        if(speed == 3){
            this.vx = 30;
        }

        let urinalEmpty = new Image(50, 100);
        urinalEmpty.src = "assets/urinal.jpg";
        let urinalFull = new Image(50, 100);
        urinalFull.src = "assets/fullurinal.jpg";

        this.sprite = urinalEmpty;
        this.spriteFull = urinalFull;

    }

    update(){
        if(this.empty){
            this.x += this.vx;
            this.collision();
        }
    }

    collision() {
        if(this.x < 0) {
            this.x = 0;
            this.vx *= -1;
        }
        if(this.x + this.sprite.width > canvas.width) {
            this.x = canvas.width - this.sprite.width;
            this.vx *= -1;
        }
    }

    draw() {
        if(this.empty) {
            c.drawImage(this.sprite, this.x, this.y, this.sprite.width, this.sprite.height);
        } else {
            c.drawImage(this.spriteFull, this.x, this.y, this.spriteFull.width, this.spriteFull.height);
        }
    }
}

class PeeAim {
    constructor (){
        this.x = 0;
        this.y = 0;
        this.visible = false;
        this.downTimer = 0;
        this.coolDown = 0;

        let pee = new Image(40, 40);
        pee.src = "assets/pee.png";
        this.sprite = pee;

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
            c.drawImage(this.sprite, this.x - 25, this.y - 25, this.sprite.width, this.sprite.height);
        }
    }

    collision(urinal) {
        if(this.down) {
            return (urinal.x < this.x + 20 && urinal.y < this.y + 20 && urinal.x + urinal.sprite.width > this.x - 20 && urinal.y + urinal.sprite.height > this.y - 20);
        }
    }
}

class UrinalRunner {
    constructor (){
        this.urinalOne = new Urinal(50, 1);
        this.urinalTwo = new Urinal(200, 2);
        this.urinalThree = new Urinal(350, 3);
        this.peeAim = new PeeAim();
        this.gameOver = false;
    }

    update(){
        this.peeAim.update();
        this.urinalOne.update();
        this.urinalTwo.update();
        this.urinalThree.update();

        if(this.urinalOne.empty && this.peeAim.collision(this.urinalOne)){
            this.urinalOne.empty = false;
        }

        if(this.urinalTwo.empty && this.peeAim.collision(this.urinalTwo)){
            this.urinalTwo.empty = false;
        }

        if(this.urinalThree.empty && this.peeAim.collision(this.urinalThree)){
            this.urinalThree.empty = false;
        }
        
        if(!this.urinalOne.empty && !this.urinalTwo.empty && !this.urinalThree.empty) {
            this.gameOver = true;
        }
    }

    draw(){
        this.urinalOne.draw();
        this.urinalThree.draw();
        if(!this.gameOver) {
            this.urinalTwo.draw();
            this.peeAim.draw();
        } else {
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillStyle = "black";
            c.font = "30px Courier New";
            c.fillText("Nice Aim Partner", canvas.width/2, canvas.height/2);
        }
    }

}

let gameRunner = new UrinalRunner();
setInterval(function() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#03fcc2";
    c.fillRect(0, 0, canvas.width, canvas.height);

    gameRunner.update();
    gameRunner.draw();
}, 15);