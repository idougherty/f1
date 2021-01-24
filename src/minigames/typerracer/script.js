let canvas = document.getElementById("paper");
let c = canvas.getContext("2d");

const quoteList = ['Hello my name is Aydin', 'I hope that this works', 'The quick brown fox jumped over the lazy dog','Another filler sentence I made', 'Ten seconds for one sentence', 'Not a lot of space here tbh', 
'If you or a loved one has been diagnosed with mesothelioma, you may be entitled to financial compensation.'];
const nonAcceptedStrings = ['Shift', 'Control', 'Tab', 'Enter', 'ScrollLock', 'Pause', 'Delete', 'End', 'PageDown', 'PageUp', 'CapsLock', 'NumLock', 'Home', 'Escape', 'Alt', 'Meta', 'ContextMenu', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];

playerInput = [];

function fitTextOnCanvas(text,fontface,xPosition, yPosition){    
    var fontsize=25;
    do{
        fontsize--;
        c.font=fontsize+"px "+fontface;
    }while(c.measureText(text).width>canvas.width)

    c.fillText(text,xPosition,yPosition);

}

class Background{
    constructor(){
        let finishLine = new Image(50, 150);
        finishLine.src = "assets/finishline.png";
        this.finishSprite = finishLine;

        let crowd = new Image(650, 50)
        crowd.src = "assets/crowd.png";
        this.crowdSprite = crowd;
    }

    draw(){
        c.drawImage(this.finishSprite, 500, 60, this.finishSprite.width, this.finishSprite.height);
        c.drawImage(this.crowdSprite, 25, 0, this.crowdSprite.width, this.crowdSprite.height);
        c.drawImage(this.crowdSprite, 25, 220, this.crowdSprite.width, this.crowdSprite.height);
        c.strokeRect(25,60, 650, 150);
        c.strokeRect(25, 370, 650, 60);
    }
}

class Car{
    constructor(quoteChoice, quoteLetters){
        this.lastPlayerInput = playerInput.length;
        this.x = 50;
        this.y = 110;
        this.lengthIncrease = 500.0 / quoteList[quoteChoice].length;
        this.quoteLetters = quoteLetters;
        this.totalRight = 0;
        this.anyIncorrect = false;
        
        
        let testCar = new Image(50,50);
        testCar.src = "assets/testcar.png";
        this.sprite = testCar;
    }

    draw(){
        c.drawImage(this.sprite, this.x, this.y, this.sprite.width, this.sprite.height);
    }

    update(){
        for(let i = 0; i < playerInput.length; i ++){
            if(i > 0){
                if(playerInput[i].localeCompare(this.quoteLetters[i]) == 0){
                    if(playerInput[i - 1].localeCompare(this.quoteLetters[i - 1]) == 0)
                        this.totalRight++;
                }
                else{
                    this.anyIncorrect = true;
                }
            }
            else{
                if(playerInput[0].localeCompare(this.quoteLetters[0]) == 0){
                    this.totalRight++;
                }
                else{
                    this.anyIncorrect = true;
                }
            }
        }
        if(playerInput.length > this.lastPlayerInput){
            for(let i = this.lastPlayerInput; i < playerInput.length; i++){
                if(playerInput[i].localeCompare(this.quoteLetters[i]) == 0 && !this.anyIncorrect){
                    this.x += this.lengthIncrease;
                }
            }



        }
        else{
            if(playerInput.length < this.lastPlayerInput){
                for(let i = playerInput.length; i < this.lastPlayerInput; i++){
                    if(this.x > 50 && (this.totalRight * this.lengthIncrease < this.x - this.lengthIncrease)){
                        this.x -= this.lengthIncrease;
                    }
                }


            }
        }
        this.lastPlayerInput = playerInput.length;
        this.totalRight = 0;
        this.anyIncorrect = false;
    }
}

class TypeRunner{
    constructor(){
        this.random = Math.round(Math.random() * (quoteList.length - 1));
        
        this.quoteLetters = [];
        this.gameWon = false;
        this.gameLost = false;



        for(let i = 0; i < quoteList[this.random].length; i++){
            this.quoteLetters.push(quoteList[this.random].substring(i, i + 1));
        }

        this.car = new Car(this.random, this.quoteLetters);
        this.backDrop = new Background();

        this.clock = 0;
        this.endTime = 10000;
        this.assembledInput = "";
    }

    update(dt){
        if(!this.gameLost){
            this.clock += dt;
            this.car.update();
            for(let i = 0; i < playerInput.length; i++){
                this.assembledInput = this.assembledInput + playerInput[i];
            }
        }
        
        
        if(this.clock >= this.endTime){
            this.clock = this.endTime;
            this.gameLost = true;
        }

        if(quoteList[this.random].localeCompare(this.assembledInput) == 0){
            this.gameWon = true;
        }
    }  
    draw(){
        this.backDrop.draw();
        this.car.draw();
        if(this.gameLost && !this.gameWon){
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillStyle = "black";
            c.font = "30px Courier New";
            c.fillText("Major L Dog", canvas.width / 2, 320);
        }
        else{
            if(!this.gameWon){
                c.fillStyle = "black";
                fitTextOnCanvas(quoteList[this.random], "Courier New", 25, 320);
            
                c.fillStyle = "black";
                fitTextOnCanvas(this.assembledInput, "Courier New", 30, 390);
                
                c.fillText(parseFloat(10 - this.clock/1000).toFixed(2), 600, 360 );
                this.assembledInput = "";
                
            }
            else{
                c.textAlign = "center";
                c.textBaseline = "middle";
                c.fillStyle = "black";
                c.font = "30px Courier New";
                c.fillText("God Typer Man", canvas.width / 2, 320);
            }   
        } 
        this.assembledInput = "";
    }
}


gameRunner = new TypeRunner();

get_time = function() {
    let d = new Date();
    let t = d.getTime();
    return t;
}
let last_time = get_time();
let current_time = get_time();

setInterval(function() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#34d8eb";
    c.fillRect(0, 0, canvas.width, canvas.height);
    current_time = get_time();
    gameRunner.update(current_time - last_time);
    gameRunner.draw();
    last_time = current_time;
}, 15);

document.addEventListener("keydown", function(k) {
    val = k.key;
    if(val.localeCompare("Backspace") == 0){
        if(playerInput.length > 0){
            let popped = playerInput.pop();
        }
    }
    else{
        properStringCheck = true;
        for(let i = 0; i < nonAcceptedStrings.length; i++){
            if(val.localeCompare(nonAcceptedStrings[i]) == 0){
                properStringCheck = false;
            }
        }
        if(properStringCheck){
            playerInput.push(val);
        } 
    }
});