//car ideal exit speed*driver stats = actual ideal speed
//ideal speed * risk = actual exit speed
//car accel * accel stats = accel
//if corner, accel = 0
//car deccel * deccel stats = deccel
//entrance speed, exit speed, accel, decceleration -> big ass equation -> time taken
//if pass possible, do pass calculation
function segment(c, d, corner, length, v, angle, radius) {
    let a = c.acceleration() * d.pick(d.accel);
    const d = c.decceleration() * d.pick(d.deccel);
    if (angle != 0) {
        const cis = Math.sqrt(c.traction * angle *);
        const idealS = cis * d.pick(d.corner);
        const exitS = idealS * d.pick(d.riskR);
        if (corner) {
            a = 0;
        }
        
    } else {
        return length/v;
    }
}