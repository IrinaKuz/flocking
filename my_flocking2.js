// my_flocking2.js
var c = document.getElementById('flocking');
var ctx = c.getContext('2d');
c.width = window.innerWidth;
c.height = window.innerHeight;
c.style.border = '1px solid black';
var boidSize = 20;
var boidSpeed = 3;
var flock = [];
var flockSize = 80;
var neighborhood = 200; // neighborhood radius for fucntions cohesion and alignment

function Boid (x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
}

function setup() {
    for (let i = 0; i < flockSize; i++) {
        flock.push(new Boid(rand(c.width), rand(c.height), rand(360)));
    }
}
function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    // Square boids
    /*
    for(let i = 0; i < flock.length; i++) {
        ctx.save();
        ctx.translate(flock[i].x, flock[i].y);
        ctx.rotate(flock[i].dir * Math.PI / 180);
        ctx.fillStyle = '#D3D3D3';
        ctx.fillRect(0, 0, boidSize, boidSize);
        ctx.strokeStyle = '#A9A9A9';
        ctx.strokeRect(0, 0, boidSize, boidSize);
        ctx.beginPath();
        // draw heading line from the upper corner of boid
        ctx.moveTo(boidSize/2, boidSize/2);
        // calculate position x and y based on Boid's heading angle
        ctx.lineTo(boidSize/2, -10);
        ctx.strokeStyle="#FF0000";
        ctx.stroke();
        ctx.restore();
    }
    */
    // Triangle boids

    for(let i = 0; i < flock.length; i++) {
        ctx.save();
        ctx.translate(flock[i].x, flock[i].y);
        ctx.rotate(flock[i].dir * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-5,15);
        ctx.lineTo(5, 15);
        ctx.fill();
        ctx.beginPath();
        // draw heading line from the upper corner of boid
        ctx.moveTo(0, 0);
        // calculate position x and y based on Boid's heading angle
        ctx.lineTo(0, -10);
        ctx.strokeStyle="#FF0000";
        ctx.stroke();
        ctx.restore();
    }

}

function logic() {
    for(let i = 0; i < flock.length; i++) {
        /* Chaotic boids' movement, no rules
        flock[i].x = checkBordersX(flock[i].x + posX(flock[i].dir));
        flock[i].y = checkBordersY(flock[i].y + posY(flock[i].dir));
        */
        separation(flock[i]);
        cohesion(flock[i]);
        alignment(flock[i]);
        flock[i].x = checkBordersX(flock[i].x);
        flock[i].y = checkBordersX(flock[i].y);
        draw();
    }
}
function cohesion(boid) {
    // calculate average position of all boids in neighborhood
    // number of boids in neighborhood
    var d = 0;
    var count = 0;
    var steer = 0; // steer angle that boid needs to steer to average position
    var centerX = 0; // average of boid's x position in neighborhood
    var centerY = 0; // average of boid's y position in neighborhood
    for (let i = 0; i < flock.length; i++) {
        if (distance(boid, flock[i]) <= neighborhood) {
            centerX += flock[i].x;
            centerY += flock[i].y;
            count++;
        }
    }
    if (count > 0) {
        centerX = centerX / count;
        centerY = centerY / count;
    }
    else {
        centerX = rand(c.width);
        centerY = rand(c.height);
    }
    // find direction to the average position
    var steer = angleBetween(boid.x, boid.y, centerX, centerY);
    var lerpAngle = angleDifference(boid.dir, steer);
    boid.dir = boid.dir + (lerpAngle * 0.01);
    var headingX = posX(boid.dir);
    var headingY = posY(boid.dir);
    boid.x = boid.x + headingX;
    boid.y = boid.y + headingY;

}
function separation(boid) {
    // calculate distance from the boid to neighborhood boids, if dist < 30
    // take opposite direction
    var centerX = 0;
    var centerY = 0;
    var count = 0;
    var dist = 30;
    for (let i = 0; i < flock.length; i++) {
        if (distance(boid, flock[i]) <= dist) {
            centerX += flock[i].x;
            centerY += flock[i].y;
            count++;
        }
    }
    if (count > 0) {
        centerX = centerX / count;
        centerY = centerY / count;
    }
    else {
        return;
    }
    var steer = angleBetween(boid.x, boid.y, centerX, centerY) + 180;
    var lerpAngle = angleDifference(boid.dir, steer);
    boid.dir = boid.dir + (lerpAngle * 0.02);
    var headingX = posX(boid.dir);
    var headingY = posY(boid.dir);
    boid.x = boid.x + headingX;
    boid.y = boid.y + headingY;
}
function alignment(boid) {
    // calculate distance from the boid to neighborhood boids, if neighborhood < 250
    // find average direction of the boids. Adjust average direction of the boid to average
    // direction of neighborhood boids.
    // number of boids in neighborhood
    var count = 0;
    var averageDir = 0;
//    var centerX = 0; // average of boid's x position in neighborhood
//    var centerY = 0; // average of boid's y position in neighborhood
    for (let i = 0; i < flock.length; i++) {
        if (distance(boid, flock[i]) <= neighborhood) {
            averageDir += flock[i].dir;
            count++;
        }
    }
    if (count > 0) {
        averageDir = averageDir / count;
    }
    else return;
    var lerpAngle = angleDifference(boid.dir, averageDir);
    boid.dir = boid.dir + (lerpAngle * 0.03);
    var headingX = posX(boid.dir);
    var headingY = posY(boid.dir);
    boid.x = boid.x + headingX;
    boid.y = boid.y + headingY;
}
function distance(a, b) {
    return Math.sqrt((Math.pow(a.x - b.x, 2)) + (Math.pow(a.y - b.y, 2)));
}
function rand(max) {
    return Math.floor(Math.random()*max);
}
function posX(angle) {
    return Math.sin(angle * Math.PI/ 180) * boidSpeed;
}
function posY(angle) {
    return 1- Math.cos(angle * Math.PI/ 180) * boidSpeed;
}
function checkBordersX(pos) {
    if(pos < 0) {
        return c.width;
    }
    else if(pos > c.width) {
        return 0;
    }
    return pos;
}
function checkBordersY(pos) {
    if(pos < 0) {
        return c.height;
    }
    else if(pos > c.height) {
        return 0;
    }
    return pos;
}
function angleBetween(x1, y1, x2, y2) {
    return Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI;
}
function angleDifference(a1, a2) {
    return ((((a1 - a2) % 360) + 540) % 360) - 180;
}
setup();
draw();
setInterval(logic, 100);