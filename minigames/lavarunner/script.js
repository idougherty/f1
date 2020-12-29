let canvas = document.getElementById("paper");
let c = canvas.getContext("2d");

class Runner {
    constructor() {
        this.x = 60;
        this.y = canvas.height/2 - 20;
        this.state = "still";
        this.active = false;

        let spriteLeft = new Image(40, 40);
        spriteLeft.src = "assets/runningmanleft.png";
        let spriteRight = new Image(40, 40);
        spriteRight.src = "assets/runningmanright.png";
        let spriteStill = new Image(40, 40);
        spriteStill.src = "assets/runningmanstill.png";
        let spriteWon = new Image(40, 40);
        spriteWon.src = "assets/runningmanwon.png";

        this.sprite = {
            left: spriteLeft,
            right: spriteRight,
            still: spriteStill,
            won: spriteWon,
        }
    }

    update(state) {
        if(state != "still" && state != this.state) {
            this.x += 10;
        }

        this.state = state;
        
    }

    draw() {
        switch(this.state) {
            case "left":
                c.drawImage(this.sprite.left, this.x, this.y, this.sprite.left.width, this.sprite.left.height);
                break;
            case "right":
                c.drawImage(this.sprite.right, this.x, this.y, this.sprite.right.width, this.sprite.right.height);
                break;
            case "still":
                c.drawImage(this.sprite.still, this.x, this.y, this.sprite.still.width, this.sprite.still.height);
                break;
            case "won":
                c.drawImage(this.sprite.won, this.x, this.y, this.sprite.still.width, this.sprite.still.height);
                break;
            default:
                console.log("state not found")
        }
    }
}

class lavaRunner {
    constructor() {
        this.runner = new Runner();
        this.lava = -150;
        this.countDown = 3;
        this.gameOver = false;

        let finishLineSprite = new Image(20, 80);
        finishLineSprite.src = "assets/finishline.png"
        this.lineSprite = finishLineSprite;
    }

    update() {
        this.countDown -= .02;
        if(this.countDown > 0) {
            this.drawCountDown();
        } else if (!this.gameOver) {
            this.runner.active = true;

            this.lava += 1.2 + (this.runner.x - this.lava - 10)/100;
            if(this.runner.x < this.lava) {
                this.runner.active = false;
                this.gameOver = true;
                this.runner.state = "still";
            }
            if(this.runner.x > canvas.width - 100) {
                this.runner.active = false;
                this.gameOver = true;
                gameRunner.runner.update("left");
                gameRunner.runner.update("right");
                this.runner.state = "won";
            }
        } else {
            if(this.runner.state == "won") {
                this.lava -= 1.2;
            } else {
                this.lava += 6;
            }
        }
    }

    draw() {
        c.drawImage(this.lineSprite, canvas.width - 100, canvas.height/2 - 40, this.lineSprite.width, this.lineSprite.height);
        
        this.runner.draw();

        c.fillStyle = "#FFAF87";
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(0, canvas.height);
        c.lineTo(this.lava + 150, canvas.height);
        c.lineTo(this.lava - 150, 0);
        c.lineTo(0, 0);
        c.closePath();
        c.fill();

        if(this.gameOver && this.runner.state != "won") {
            c.fillStyle = "white";
            c.font = "20px Courier New";
            c.fillText("damn you really died", canvas.width/2, canvas.height/2);
        }
    }

    drawCountDown() {
        let opacity = this.countDown - Math.floor(this.countDown) + .4;
        c.fillStyle = "rgba(255, 255, 255, "+(opacity*opacity)+")";
        c.font = "120px Courier New";
        c.fillText(Math.ceil(this.countDown), canvas.width/2, canvas.height/2);
    }
}

let gameRunner = new lavaRunner();

document.addEventListener("keydown", function(e) {
    switch(e.keyCode) {
        case 65:
        case 37:
            if(gameRunner.runner.active) {
                gameRunner.runner.update("left");
            }
            break;
        case 68:
        case 39:
            if(gameRunner.runner.active) {
                gameRunner.runner.update("right");
            }
            break;
        default:
    }
});

function gameLoop() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#FF8E72";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#fff";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "20px Courier New";
    c.fillText("use left and right arrows to take steps, avoid the lava", canvas.width/2, canvas.height/4);

    gameRunner.update();
    gameRunner.draw();

    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);