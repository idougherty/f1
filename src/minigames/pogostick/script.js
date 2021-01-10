var canvas = document.getElementById("paper");
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;

var STICK_HEIGHT = 24;
var JUMP_STRENGTH = 7;
var SCREEN_DIMS = {width: 720, height: 480};

class PogoDude {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.drot = 0;
        this.rotation = 0; // in degrees: 0 is up, - is left, + is right, -180 == 180 == down
        this.in_air = false;
        this.sprite = new Image(12, 48);
        this.sprite.src = "assets/placeholder_pogo_man.png";
    }

    update(input, hit_ground, dt) {

        // this adjusts for different FPS to make movement consistent
        let frame_mod = 15 / dt;

        let momentum = JUMP_STRENGTH;

        // hit ground
        if (/*touching ground?*/ hit_ground) {
            // rotation should be dampened significantly on landing
            if (this.in_air) {
                this.drot *= 0.25;
                this.y -= this.dy / 2;
                this.x -= this.dx / 2;
                momentum = Math.max(JUMP_STRENGTH, Math.sqrt(this.dy ** 2 + this.dx ** 2) * 0.95);
            }

            this.in_air = false;
            this.dy = 0;
            this.dx = 0;
        } else {
            this.in_air = true;
        }

        // acceleration
        this.x += this.dx * frame_mod;
        this.y += this.dy * frame_mod;
        this.rotate(this.drot);
        if (this.in_air) {
            this.dy += 0.15;
        } else {
            this.drot += 0.1 * Math.sin(this.rotation / 180 * Math.PI);
        }

        // jumping
        if (!this.in_air) {
            this.in_air = true;
            this.dx = momentum * Math.sin(this.rotation / 180 * Math.PI);
            this.dy = -momentum *  Math.cos(this.rotation / 180 * Math.PI);
            this.x += this.dx;
            this.y += this.dy;

            this.drot += this.dx * 0.75;
        }
        
        // lean input
        if (input.left) {
            this.drot -= 0.1;
            if (this.in_air) {
                this.drot -= 0.1;
            }
        }
        if (input.right) {
            this.drot += 0.1;
            if (this.in_air) {
                this.drot += 0.1;
            }
        }

        // Control the spin (dont let it get too crazy)
        this.drot *= 0.998;
        if (this.drot > 4) {
            this.drot = 4;
        }
        if (this.drot < -4) {
            this.drot = -4;
        }
    }

    draw() {
        ctx.save();
        console.log(ctx);
        ctx.translate(SCREEN_DIMS.width / 2, SCREEN_DIMS.height / 2);
        ctx.rotate(this.rotation / 180 * Math.PI);
        ctx.drawImage(this.sprite, this.sprite.width / -2, this.sprite.height / -2, this.sprite.width, this.sprite.height);
        ctx.restore();
    }

    rotate(deg) {
        deg = deg % 360;
        var theta1 = this.rotation;
        var theta2 = deg;
        var theta3 = theta1 + theta2;
        this.rotation += deg;
        if (this.rotation <= -180) {
            this.rotation += 360;
        }
        if (this.rotation > 180) {
            this.rotation -= 360;
        }
        if (!this.in_air) {
            this.move_by( STICK_HEIGHT * (Math.sin(theta3 / 180.0 * Math.PI) - Math.sin(theta1 / 180.0 * Math.PI)),
                          -STICK_HEIGHT * (Math.cos(theta3 / 180.0 * Math.PI) - Math.cos(theta1 / 180.0 * Math.PI)));
        }
    }

    get_base_point() {
        return {x: this.x - STICK_HEIGHT * Math.sin(this.rotation / 180 * Math.PI),
                y: this.y + STICK_HEIGHT * Math.cos(this.rotation / 180 * Math.PI)}
    }

    move_to(x, y) {
        this.x = x;
        this.y = y;
    }

    move_by(dx, dy) {
        this.move_to(this.x + dx, this.y + dy);
    }
}

class Obstacle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = 0;

        this.sprite = new Image(8, 8);
        this.sprite.src = "assets/obstacle.png";
    }

    point_intersects(x, y) {
        let width_intersects = x < this.x + this.width && x > this.x;
        let height_intersects = y < this.y + this.height && y > this.y;
        return width_intersects && height_intersects;
    }

    draw(offset) {
        ctx.drawImage(this.sprite, this.x - offset.x, this.y - offset.y, this.width, this.height);
    }
}

class Game {
    constructor() {
        this.restart();
    }

    restart() {
        this.running = true;
        this.pogo_dude = new PogoDude(SCREEN_DIMS.width/2, SCREEN_DIMS.height/2);

        this.obstacles = [];
        this.obstacles.push(new Obstacle(200, 300, 300, 30));
        this.obstacles.push(new Obstacle(400, 100, 100, 200));
        this.obstacles.push(new Obstacle(50, 0, 100, 300));
        this.obstacles.push(new Obstacle(500, 100, 300, 20));
        this.obstacles.push(new Obstacle(500, 100, 300, 20));

        this.input = {
            left: false,
            right: false,
            jump: false
        };
    }

    update(dt) {

        let collision = false;

        let pt = this.pogo_dude.get_base_point();

        for (var i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].point_intersects(pt.x, pt.y)) {
                collision = true;
                break;
            }
        }

        this.pogo_dude.update(this.input, collision, dt);

        if (!this.running) {
            this.restart();
        }
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#55BBFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let offset = {x: this.pogo_dude.x - SCREEN_DIMS.width / 2, y: this.pogo_dude.y - SCREEN_DIMS.height / 2};

        this.pogo_dude.draw();
        for (var i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].draw(offset);
        }
    }
}

var game = new Game();

get_time = function() {
    let d = new Date();
    let t = d.getTime();
    return t;
}

let last_time = 0;
let current_time = get_time();
setInterval(function() {
    current_time = get_time();
    game.update(current_time - last_time);
    game.draw();
    last_time = current_time;
}, 15);

document.addEventListener("keydown", function(k) {
    switch(k.keyCode) {
        case 37:
            game.input.left = true;
            break;
        case 39:
            game.input.right = true;
            break;
        case 32:
            game.input.jump = true;
            break;
        default:
    }
});

document.addEventListener("keyup", function(k) {
    switch(k.keyCode) {
        case 37:
            game.input.left = false;
            break;
        case 39:
            game.input.right = false;
            break;
        case 32:
            game.input.jump = false;
            break;
    }
});