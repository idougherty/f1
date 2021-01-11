/*
Age - dynamic (age lol) , visible
C P Neck strength - dynamic (exercise) , visible after research
S C P G Tiredness - dynamic (more drivers, energy drink) , visible after research
C P N Intelligence - dynamic (exercise) , invisible
C P Depth perception - dynamic (glasses), visible after research
S C P G N Experience - dynamic (amount of races) , invisible
(pits) Bladder size - risk of peeing pants - dynamic(but quite risky) (surgery) , visible after research
S G N Ambition - dynamic (loss streak combined with ego and sense of self) , invisible
C P Creativity - static , invisible
P G Risk taking  - dynamic (crash) , invisible
S C Platonic attraction to car - static , invisible
P G N Sexual attraction to car - dynamic (crash) , invisible 
(increase to one) Dog person vs cat person - static , visible after research
(increase to one) Favorite type of pickles - static , visible
P G N Ego - dynamic (loss streak)(it’s harder to lower a very high ego), invisible
Introvert (increase to S C) or extravert (increase to P G) - static , visible after research
P G Aggression - dynamic (crash) , invisible
C P N Sense of self - dynamic (crash) , invisible
Size - dynamic (surgery) , visible
Weight - dynamic (surgery) , visible
(dont get em drunk!) Alcohol tolerance - dynamic (exercise) , visible after research
(maybe a unique thingy) - teams must be compatible Astrological signs - static , visible
S C P G N Love of the sport - static , invisible
N Loyalty - dynamic (treatment?) , visible after research
N Morality - dynamic (money) , visible after research
N public perception (win streak with ego)
*/
// Standard Normal variate using Box-Muller transform.
function randn_bm(min, center, max, vari) {
    var u = 0, v = 0, x = 0;
    while(x < min || x > max){
        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        x = center + vari* Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        if(x < min || x > max) x = center;
    }
    return x;
}

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
  }
 
class Stats{
    glasses(){
        let x = Math.random()
        if(x < 0.25) return Math.random()*77;
        else{
            return ((Math.random()*22)+78);
        }
    }
    expMultiplier(){
        let x = Math.random*10000000;
        if(x == 10000000){
            soClose = Math.random();
            if(soClose < 0.5) return 0.5;
            else{
                return 2;
            }
        }
        if(x < 100000){
            return random(0.666,1.5);
        }
        else{
            return random(0.95,1.05)
        }
    }
    exp(age){
        return((100*age-1000)/age)*this.eMult;
    }

    pick(list){
        var p1, p2, p3;
        p1 = Math.floor(Math.random() * list.length);
        p2 = Math.floor(Math.random() * (list.length-1));
        if (p1 === p2) {
            p2++;
        }
        p2 = Math.floor(Math.random() * (list.length - 2));
        if (p3 === p1) {
            p3++;
        }
        if (p3 === p2) {
            p3++;
        }
        return list[p1]+list[p2]+list[p3];
    }

    pickles(p){
        return p;
    }
    zodiac(){
        this.sign = "";
        let x = Math.floor(Math.random() * 12);
        switch (x) {
            case 0:
                sign = "capricorn";
                break;
            case 1:
                sign = "aquarius";
                break;
            case 2:
                sign = "pisces";
                break;
            case 3:
                sign = "aries";
                break;
            case 4:
                sign = "taurus";
                break;
            case 5:
                sign = "gemini";
                break;
            case 6:
                sign = "cancer";
                break;
            case 7:
                sign = "leo";
                break;
            case 8:
                sign = "virgo";
                break;
            case 9:
                sign = "libra";
                break;
            case 10:
                sign = "scorpio";
                break;
            case 11:
                sign = "sagittarius";
                break;
            default:
        }
        return sign;
    }
    constructor(){
        this.neck = Math.random()*100;
        this.tired = Math.random()*100;
        this.intel = Math.random()*100;
        this.percept = this.glasses();
        this.age = randn_bm(10,20,100,10);
        this.eMult = this.expMultiplier();
        this.dExp = this.exp(this.age);
        this.bladder = randn_bm(1,50,100,10);
        this.ambition = Math.random()*100;
        this.creative = Math.random()*100;
        this.risk = Math.random()*100;
        this.plat = Math.random()*100;
        this.sex = Math.random()*100;
        this.dog = Math.floor(Math.random()*2);
        this.pickle = 'dill lol';
        this.ego =  Math.random()*100;
        this.social = Math.floor(Math.random()*2);
        this.agression = Math.random()*100;
        this.self =  Math.random()*100;
        this.hieght = randn_bm(22,69,107,15);
        this.weight = random(50,300);
        this.bmi = this.weight/Math.pow(this.hieght,2);
        this.toler = Math.random()*100;
        this.los = randn_bm(1,50,100,5);
        this.loyal = Math.random()*100;
        this.moral = Math.random()*100;
        this.pubP = 50;
        this.sign = this.zodiac;
        this.accel = [this.dExp, this.ambition, this.risk, this.sex, this.los];
        this.deccel = [this.neck, this.intel, this.percept, this.dExp, this.plat, this.los];
        this.corn = [this.neck, 100-this.tired, this.intel, this.percept, this.dExp, this.creative, this.plat, this.self, this.los];
        this.riskR = [this.tired, this.exp, this.risk, this.ambition, this.sex, this.ego, this.agression];
        this.pass = [this.neck, 100-this.tired, this.intel, this.percept, this.dExp, this.creative, this.risk, this.sex, this.ego, this.agression, this.self, this.los];
        this.gas = [100-this.tired, this.dExp, this.risk, this.ambition, this.sex, this.ego, this.agression, this.los];
    }
    bonk(){
        console.log('neck ' + this.neck);  
        console.log('tired ' + this.tired);  
        console.log('intel '+ this.intel); 
        console.log('percept '+this.percept); 
        console.log('age '+ this.age); 
        console.log('eMult '+ this.eMult); 
        console.log('dExp '+ this.dExp); 
        console.log('bladder '+ this.bladder);
        console.log('ambition '+ this.ambition);
        console.log('creative '+ this.creative);
        console.log('risk '+ this.risk);
        console.log('plat '+ this.plat);
        console.log('sex '+ this.sex);
        console.log('dog '+this.dog);
        console.log('pickle '+ this.pickle);
        console.log('ego '+ this.ego);
        console.log('social '+ this.social);
        console.log('agression '+ this.agression);
        console.log('self '+ this.self);
        console.log('hieght '+ this.hieght); 
        console.log('weight '+ this.weight); 
        console.log('bmi '+ this.bmi); 
        console.log('toler '+ this.toler); 
        console.log('los '+ this.los);
        console.log('loyal '+ this.loyal);
        console.log('moral '+ this.moral);
        console.log('pubP '+ this.pubP);
        console.log('sign '+ this.sign); 
    }     
}

let player = new Stats();
player.bonk();