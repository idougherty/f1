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

class Backdrops {
    constructor(){
        let top = new Image(400, 200);
        top.src = "assets/top.jpg";
        let tray = new Image(200,200);
        tray.src = "assets/tray.png";

        this.topSprite = top;
        this.traySprite = tray;
    }

    draw(){
        c.drawImage(this.topSprite, 100, 0, this.topSprite.width, this.topSprite.height);
        c.drawImage(this.traySprite, 500,250, this.traySprite.width, this.traySprite.height);
    }
}


class Tooth {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.isBroken = false;
        this.isDraggable = false;
        this.moving = false;

        let tooth = new Image(50, 50);
        tooth.src = "assets/tooth.png";
        let toothBad = new Image(50, 50);
        toothBad.src = "assets/badtooth.png";

        this.sprite = tooth;
        this.spriteBad = toothBad;
    }

    update(){
        if(this.isDraggable){
            if(this.moving){
                this.x = mouse.x - 100;
                this.y = mouse.y - 25;
            }   
        }
    }
    
    draw(){
        if(this.isBroken){
            c.drawImage(this.spriteBad, this.x, this.y, this.spriteBad.width, this.spriteBad.height);
        }
        else{
            c.drawImage(this.sprite, this.x, this.y, this.sprite.width, this.sprite.height);  
        }
    }

}

class ToothyTool{
    //Shout out to Megan for the name ToothyTool
    constructor (){
        this.x = 600;
        this.y = 300;
        this.down = false;
        this.closed = false;

        let toothTool = new Image(100, 50);
        toothTool.src = "assets/toothytool.png";
        this.sprite = toothTool;

        let toothToolDown = new Image(100,50);
        toothToolDown.src = "assets/toothytooldown.png";
        this.spriteDown = toothToolDown;

    }
    update(){
        if(mouse.left && (mouse.x < this.x + 50 && mouse.x > this.x - 50 && mouse.y < this.y + 25 && mouse.y > this.y - 25)) {
            this.down = true;
            this.closed = true;
            this.x = mouse.x;
            this.y = mouse.y;
        }

        if(!mouse.left){
            this.down = false;   
            this.closed = false;
        }
    }

    draw(){
        if(this.closed){
            c.drawImage(this.spriteDown, this.x - this.sprite.width/2, this.y - 25, this.sprite.width, this.sprite.height);   
        }
        else{
            c.drawImage(this.sprite, this.x - this.sprite.width/2, this.y - 25, this.sprite.width, this.sprite.height);
        }
    }

    collision(tooth){
        if(this.down) {
            return(this.x - 55 < tooth.x + 50 && this.x - 45 > tooth.x + 50 && this.y - 30 < tooth.y && this.y - 20 > tooth.y);
        }
    }

}

class ToothRunner{
    constructor (){
        this.teeth = [];
        this.tool = new ToothyTool();
        this.backDrops = new Backdrops();
        this.stageOneOver = false;
        this.gameOver = false;
        this.teeth.push(new Tooth( 175, 200));
        this.teeth.push(new Tooth( 375, 200));
        this.teeth.push(new Tooth( 175, 250));
        this.teeth.push(new Tooth( 375, 250));

        this.toothRandom = Math.round(Math.random() * 3);
        this.teeth[this.toothRandom].isBroken = true;
        this.teeth[this.toothRandom].isDraggable = true;
        this.initalX = this.teeth[this.toothRandom].x;
        this.initalY = this.teeth[this.toothRandom].y;

        this.teeth.push(new Tooth(550, 350));
    }

    update(){
        if(!this.gameOver){
            this.tool.update();
            for(let i = this.teeth.length - 1; i >= 0; i--) {      
                if(this.tool.collision(this.teeth[i])) {
                    this.teeth[i].moving = true;
                    this.teeth[i].update();
                    this.teeth[i].moving = false;
                }
    
            }
    
            if(this.teeth[this.toothRandom].x < 700 && this.teeth[this.toothRandom].x > 500 && this.teeth[this.toothRandom].y < 450 && this.teeth[this.toothRandom].y > 250 ) {
                if(!mouse.left){
                    this.teeth[this.toothRandom].isDraggable = false;
                    this.teeth[this.teeth.length - 1].isDraggable = true;
                }
            }
    
            if(this.teeth[this.teeth.length - 1].x == this.initalX && this.teeth[this.teeth.length - 1].y == this.initalY){
                this.gameOver = true;
            } 
        }
    }

    draw(){
        this.backDrops.draw();
        for(let tooth of this.teeth) {
            tooth.draw();
        }
        if(!this.gameOver) {
            this.tool.draw();
        } else {
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillStyle = "black";
            c.font = "30px Courier New";
            c.fillText("Pro Dentist Man", canvas.width/2, canvas.height - 100);
        }
    }
}

gameRunner = new ToothRunner();
setInterval(function() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#a3ffe5";
    c.fillRect(0, 0, canvas.width, canvas.height);

    gameRunner.update();
    gameRunner.draw();

}, 15);