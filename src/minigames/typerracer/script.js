let canvas = document.getElementById("paper");
let c = canvas.getContext("2d");
const quoteList = [ 'Hello my name is Aydin',
                    'I hope that this works', 
                    'The quick brown fox jumped over the lazy dog','Another filler sentence I made', 
                    'Woop woo',  
                    'If you or a loved one has been diagnosed with mesothelioma, you may be entitled to financial compensation.'];

playerInput = [];

function fitTextOnCanvas(text,fontface,yPosition){    
    var fontsize=25;
    do{
        fontsize--;
        c.font=fontsize+"px "+fontface;
    }while(c.measureText(text).width>canvas.width)

    c.fillText(text,50,yPosition);

}

class Background{
    constructor(){

    }

    draw(){

    }
}

class TypeRunner{
    constructor(){
        this.quoteLetters = [];
        this.gameWon = false;
        this.gameLost = false;

        this.random = Math.round(Math.random() * (quoteList.length - 1));

        for(let i = 0; i < quoteList[this.random].length; i++){
            this.quoteLetters.push(quoteList[this.random].substring(i, i + 1));
        }
        this.clock = 0;
        this.endTime = 20000;
        this.assembledInput = "";
    }

    update(dt){
        if(!this.gameLost){
            this.clock += dt;
        }
        
        for(let i = 0; i < playerInput.length; i++){
            this.assembledInput = this.assembledInput + playerInput[i];
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
        if(this.gameLost && !this.gameWon){
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillStyle = "black";
            c.font = "30px Courier New";
            c.fillText("Major L Dog", canvas.width / 2, canvas.height / 2);
        }
        if(!this.gameWon){
            c.fillStyle = "black";
            fitTextOnCanvas(quoteList[this.random], "Courier New", canvas.height/3);
        
            c.fillStyle = "black";
            fitTextOnCanvas(this.assembledInput, "Courier New", canvas.height - 200);
            
            c.fillText(parseFloat(20 - this.clock/1000).toFixed(2), 30, 40);
            this.assembledInput = "";
        }
        else{
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillStyle = "black";
            c.font = "30px Courier New";
            c.fillText("God Typer Man", canvas.width / 2, canvas.height / 2);
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
        if(!(val.localeCompare("Shift") == 0)){
            playerInput.push(val);
        } 
    }
});