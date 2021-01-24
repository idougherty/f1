let canvas = document.getElementById("paper");
let c = canvas.getContext("2d");

class Mouse {
    x = 0;
    y = 0;
    left = false;
    right = false;
    locked = false;
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

canvas.addEventListener("mousemove", updatePos);
canvas.addEventListener("mousedown", updateState);
canvas.addEventListener("mouseup", updateState);

let mouse = new Mouse();

class Mole {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.hole = 0;
        this.timer = 0;
        this.stunTimer = 0;
        this.stunned = false;
        this.stunCount = 0;
        this.dps = false;
        this.phase = 1;
        this.dpsTimer = 0;
        this.phase3Timer = 0;
        this.hits = 0;
        this.begin = false;
        this.gameover = false;
        this.win = false;
        this.sprite = new Image(100, 100);
        this.sprite.src = "assets/MoleAngry.png";

        this.clicked = false;
    }

    update() {
        //handles game over scenarios and makes sure mole doesn't do shit before HP bar is full
        if(this.begin && !this.gameover && !this.win && !this.warcrime) {
            this.clicked = false;

            //handles stun mechanics
            if(this.stunned && !this.dps) {
                if(this.stunCount >= 4) { //at the fifth stun (4+1), starts dps mechanic
                    this.dps = true;
                }

                //the stun lasts for 30 frames (~half a second), then resets everything
                if(this.stunTimer >= 30) {
                    this.stunned = false;
                    this.stunTimer = 0;
                    this.timer = 0;
                    this.stunCount++;
                } else {
                    this.stunTimer++;
                }
            }

            //if mole isn't stunned in 67 frames (~1 second), he shoots you
            if(this.timer == 67) {
                this.sprite.src = "assets/MoleShot.png";
                this.gameover = true;
            }

            //handles click events
            if(mouse.left) {
                //mouse.locked makes it so you can't hold down left mouse to do absurd dps
                if(mouse.locked == false) {
                    mouse.locked = true;
                    if(mouse.x > this.x && mouse.x < this.x + this.sprite.width && mouse.y > this.y && mouse.y < this.y + this.sprite.height) {
                        this.clicked = true;

                        if(!this.dps) {
                            this.sprite.src = "assets/MoleStunned.png";
                            this.stunned = true;
                        } else {
                            this.hits++;
                            if(this.hits > 30 && this.hits < 70) {
                                this.phase = 2;
                            }
                            if(this.hits >= 70) {
                                this.phase = 3;
                            }
                            if(this.hits == 100) {
                                this.win = true;
                            }
                        }
                    }
                }
            } else {
                mouse.locked = false;
            }

            if(this.dps) {
                if(this.clicked == true) {
                    this.sprite.src = "assets/MoleDamaged.png";
                } else {
                    this.sprite.src = "assets/MoleStunned.png";
                }
                if(this.dpsTimer >= 201) {
                    this.dps = false;
                    this.timer = 0;
                    this.stunTimer = 0;
                    this.stunned = false;
                    this.stunCount = 0;
                    this.dpsTimer = 0;
                } else {
                    this.dpsTimer++;
                }
            }

            if(this.timer == 0 && this.phase < 3) {
                this.sprite.src = "assets/MoleAngry.png";
                //pick new hole, that's not the old one.
                let dupeHole = true;
                while(dupeHole) {     
                    newHole = Math.floor(Math.random()*6);
                    if (newHole != this.hole) {
                        dupeHole = false;
                        this.hole = newHole;
                        this.x = holes[newHole].x;
                        this.y = holes[newHole].y-0.5*this.sprite.height;
                    }
                }
            } else if (this.phase == 3 && this.phase3Timer == 29 && this.timer == 0) {
                this.sprite.src = "assets/MoleAngry.png";
                //pick new hole, that's not the old one.
                let dupeHole = true;
                while(dupeHole) {     
                    newHole = Math.floor(Math.random()*6);
                    if(!(newHole == pow1.hole) && !(newHole == pow2.hole)) {
                        dupeHole = false;
                        this.x = holes[newHole].x;
                        this.y = holes[newHole].y-0.5*this.sprite.height;
                        console.log("angrymole is moving from " + this.hole + " to " + newHole);
                        this.hole = newHole;
                    }
                }
            }

            if(!this.stunned && !this.dps && !(this.phase == 3 && !(this.phase3Timer == 29))) {
                this.timer++;
            }
        }
    }

    draw() {
        c.drawImage(this.sprite, this.x, this.y, this.sprite.width, this.sprite.height);
        
    }
}

class POW {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.hole = 0;
        this.sprite = new Image(100,100);
        this.sprite.src = "assets/MoleSurrender.png";
    }

    update() {

        if(!mole.gameover && !mole.win) {
            if(mole.phase == 2 && mole.timer == 1) {
                let badLocation = true;
                while(badLocation) {
                    let newHolePOW = Math.floor(Math.random()*6);
                    if(!(newHolePOW == mole.hole)) {
                        badLocation = false;
                        this.x = holes[newHolePOW].x;
                        this.y = holes[newHolePOW].y-0.5*this.sprite.height;
                        this.hole = newHolePOW;
                    }
                }
            } else if(mole.phase == 3 && mole.phase3Timer == 29 && (mole.timer == 0 || mole.timer == 1)) {
                let badLocation = true;
                while(badLocation) {
                    let newHolePOW = Math.floor(Math.random()*6);
                    if(!(newHolePOW == mole.hole) && !(newHolePOW == pow2.hole)) {
                        badLocation = false;
                        this.x = holes[newHolePOW].x;
                        this.y = holes[newHolePOW].y-0.5*this.sprite.height;
                        console.log("pow1 moving from " + this.hole + " to " + newHolePOW);
                        this.hole = newHolePOW;
                    }
                }
            }

            //handles click events
            if(mouse.left) {
                    if(mouse.x > this.x && mouse.x < this.x + this.sprite.width && mouse.y > this.y && mouse.y < this.y + this.sprite.height) {
                        mole.warcrime = true;
                        this.sprite.src = "assets/HurtPOW.png";
                        this.draw();
                        mole.gameover = true;
                    }
            }
        }
    }

    draw() {
        c.drawImage(this.sprite, this.x, this.y, this.sprite.width, this.sprite.height);
    }
}

class StaggeredPOW extends POW{
    constructor(x,y) {
        super(x,y);
        //this.hole = 0;
    }
    update() {
        if(!mole.gameover && !mole.win) {
            if(mole.phase == 3 && (mole.timer == 1 || mole.timer == 0) && mole.phase3Timer == 0) {
                let dupeHole = true;
                    while(dupeHole) {     
                        newHole = Math.floor(Math.random()*6);
                        if (newHole != this.hole && newHole != mole.hole && newHole != pow1.hole) {
                            dupeHole = false;
                            console.log("pow2 moving from " + this.hole + " to " + newHole);
                            this.hole = newHole;
                            this.x = holes[newHole].x;
                            this.y = holes[newHole].y-0.5*this.sprite.height;
                        }
                    }
            }

            if(mole.phase == 3 && (mole.timer == 1 || mole.timer == 0)) {
                    mole.phase3Timer++;
                    console.log(mole.phase3Timer);
                    if(mole.phase3Timer >= 30) {
                        mole.phase3Timer = 0;
                    }
            }
        }

        if(mouse.left) {
            if(mouse.x > this.x && mouse.x < this.x + this.sprite.width && mouse.y > this.y && mouse.y < this.y + this.sprite.height) {
                mole.warcrime = true;
                this.sprite.src = "assets/HurtPOW.png";
                this.draw();
                mole.gameover = true;
            }
        }
    }
}

class Hole {
    constructor(x,y) {
        this.x = x;
        this.y = y;

        this.sprite = new Image(90,40);
        this.sprite.src = "assets/hole.png";
    }

    draw() {
        c.drawImage(this.sprite, this.x, this.y, this.sprite.width, this.sprite.height);
    }
}

class HealthBar {
    constructor(x,y) {
        this.x = x;
        this.y = y;

        this.startup = 0;

        this.sprite = new Image(600,20);
        this.sprite.src = "assets/healthbar.png";

    }

    update() {
        if(!mole.begin) {
            if(this.startup < 100) {
                this.startup += 1;
            } else {
                mole.begin = true;
            }

        }
    }

    draw() {
        if(mole.begin) {
            c.drawImage(this.sprite, this.x, this.y, this.sprite.width*(100-mole.hits)/100, this.sprite.height);
        } else {
            c.drawImage(this.sprite, this.x, this.y, this.sprite.width*this.startup/100, this.sprite.height);
        }
    }
}

class HealthBarFrame {
    constructor(x,y) {
        this.x = x;
        this.y = y;

        this.sprite = new Image(603,22);
        this.sprite.src = "assets/healthbarframe.png";
    }

    draw() {
        c.drawImage(this.sprite, this.x, this.y, this.sprite.width, this.sprite.height);
    }
}

//Start Game Stuff
let mole = new Mole(1000, 1000); //offscreen for now
let pow1 = new POW(1000,1000); //this too
let pow2 = new StaggeredPOW(1000,1000);
let hp = new HealthBar(60,440);
let hpframe = new HealthBarFrame(60,440);
let holes = [];


for(i = 0; i < 6; i++) {
    let tooClose = true;

    while(tooClose) {
        let newx = Math.floor(Math.random()*(canvas.width-150)+25);
        let newy = Math.floor(Math.random()*(canvas.height-150)+25);
        let foundConflict = false;
        for(i = 0; i < holes.length; i++) {
            if(Math.abs(holes[i].x-newx) < 100 && (Math.abs(holes[i].y-newy) < 50)) {
                foundConflict = true;
            }
        }

        if(!foundConflict) {
            tooClose = false;
            newHole = new Hole(newx,newy);  
            holes.push(newHole);
        }
    }
}


setInterval(function() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#a88";
    c.fillRect(0, 0, canvas.width, canvas.height);

    if(!mole.warcrime) {
        c.fillStyle = "white";
        c.font = "15px Courier New";
        c.fillText("Objective: You have a pest problem, deal with it.", 20,20);
    } else {
        c.fillStyle = "red";
        c.font = "15px Courier New";
        c.fillText("Note: Pursuant to Article 8 of the Geneva Convention", 20,20);
        c.fillText("You have just committed a war crime", 20,40);
    }

    if(!mole.phase == 3) {
        mole.update();  
        mole.draw();

        pow1.update();
        pow1.draw();

        pow2.update();
        pow2.draw();
    } else {
        pow2.update();
        pow2.draw();

        mole.update();  
        mole.draw();

        pow1.update();
        pow1.draw();
    }

    for(i = 0; i < 6; i++) {
        holes[i].draw();
    }

    hp.update();
    hp.draw();
    hpframe.draw();

    if(mole.gameover == true) {
        c.fillStyle = "red";
        c.font = "50px Courier New";
        c.fillText("Game Over", canvas.width/3, canvas.height/2);
    } else if(mole.win == true) {
        c.fillStyle = "Green";
        c.font = "50px Courier New";
        c.fillText("Pest Eradicated", canvas.width/3, canvas.height/2);
    } else {
        c.fillStyle = "white";
        c.font = "20px Courier New";
        c.fillText("Angry Mole, Scourge of the Earth", canvas.width/2-200, 430);
    }
    

}, 15);