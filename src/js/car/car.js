/*
weight
size
traction
handling
acceleration
top speed
deceleration
*/


class car {
	constructor(fr, s, b, e, fu, a, t) {
		this.frame = fr;
		this.sus = s;
		this.brake = b;
		this.eng = e;
		this.fuel = fu;
		this.aero = a;
		this.tires = t; //array of four tires
		this.parts = [this.frame, sus, brake, eng, this.fuel, this.aero, tires[0], tires[1], tires[2], tires[3]];
	}

	weight(){
		let ret = 0;
		for(let i = 0; i < this.parts.length; i++){
			ret += this.parts[i].curWeight;
		}
		return ret;
	}

	size(){
		return (this.frame.size + this.aero.size);
	}
	
	avgTQ(){
		return (tires[0].quality + tires[1].quality + tires[2].quality + tires[3].quality)/4;
	}

	
	traction(){
		return (this.avgTQ*(this.weight+this.aero.downF));
	}

	handle(){
		return (this.traction * this.sus.spronginess);
	}

	acceleration(){
		//fuel quality, revs, hrps, traction, drag, weight
		return((this.fuel.quality*this.eng.hrp)+(this.eng.maxRev+this.traction))/(this.aero.drag+this.weight);
	}

	topSpeed(){
		//weight, drag, hrps, revs, traction, fuel quality
		return (this.eng.maxRev*this.acceleration)/this.aero.drag;
	}

	deceleration(){
		//traction, breaks, weight, drag 
		return (this.traction * this.brake.quality + this.aero.drag)/this.weight
	}

	/*
	straight
	turn 
	*/

	idealSpeed(radius, angle){
		return Math.sqrt(radius * angle * this.traction);
	}




}