class part {
	damage (d) {
		if (d > curStrength) {
			this.break();
		}
		curStrength -= d * dModifier;
	}
	break () {
		broken = true;
		//based on pit quality and distance to pit stop, certain amount of time lost then you can start again if you can replace part.
	}
	segment () {

	}
	constructor(s, w, dm, d, car, c) {
		this.broken = false;
		this.strength = s; //base strength
		this.weight = w; //base weight
		this.dModifier = dm; //modifier for damage taken
		this.curStrength = this.strength; //live strength after any damage taken
		this.curWeight = this.weight; //live weight if anything modifies it
		this.descriptions = d; //array of description(inititial, first research, second, etc. When last one is reached you are told)
		this.car = car; //car its connected to
		this.cost = c; //cost of each part to stock
	}
}

/*class material {
	constructor(d, s) {
		this.density = d;
		this.strength = s;
	}
}

class shape {
	constructor(size, strength) {
		this.size = size;
		this.strength = strength;
	}
}*/

class frame extends part {
	constructor(s, w, dm, d, car, c, size) {
		//this.shap = shap;
		//this.mat = mat;
		//super(shap.strength*size.strength, shap.size*mat.density, dm, d);
		this.size = size;
		super(s,w,dm,d,car,c);
	}
}

class suspension extends part {
	segment() {
		if (broken) {
			car.frame.damage(10);
		}
	}
	constructor(s, w, dm, d, car, c, sp) {
		this.spronginess = sp;
		super(s, w, dm, d, car, c);
	}
}

class brakes extends part {
	damage(d) {
		curStrength -= d * dm * heat;
	}
	segment() {
		heat *= coolFactor;
	}
	constructor(s, w, dm, d, car, c, q, cf) {
		this.quality = q;
		this.coolFactor = cf;
		this.heat = 0;
		super(s, w, dm, d, car, c);
	}
}

class engine extends part {
	break() {
		car.frame.damage(damFactor);
		car.suspension.damage(damFactor);
		car.brakes.damage(damFactor);
		car.transmission.damage(damFactor);
		car.nose.damage(damFactor);
		car.side.damage(damFactor);
		car.wing.damage(damFactor);
		car.tires.damage(damFactor);
		if (math.random() < damFactor/size) {
			//player fucking dies
		}
	}
	segment() {
		car.fuel.damage(efficiency);
	}
	constructor(s, w, dm, d, car, c, df, e, mr, h, complex) {
		this.damFactor = df;
		this.efficiency = e;
		this.maxRev = mr;
		this.hrp = h;
		this.complex = complex;
		super(s, w, dm, d, car, c);
	}
}

class fuel extends part {
	constructor(s, w, dm, d, car, c) {
		super(s, w, dm, d, car, c);
	}
}

class aero extends part {
	break() {
		broken = true;
		drag = car.frame.size;
		this.downF = 1;
	}
	constructor(s, w, dm, d, car, c, drag, df) {
		this.drag = drag;
		this.downF = df;
		super(s, w, dm, d, car, c);
	}
}

class tire extends part {
	constructor(s, w, dm, d, car, c, q) {
		this.quality = q;
		super(s, w, dm, d, car, c);
	}
}