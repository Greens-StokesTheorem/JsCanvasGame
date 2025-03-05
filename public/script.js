
const canvas = document.getElementById("gamecanvas");
const ctx = canvas.getContext("2d");
let PlayerId;
let keys = {up: false, down: false, left: false, right: false};
let boost = {up: false, down: false, left: false, right: false};
let boostvelo = 140;
let spacepressed = false;
let speed = 4;
let thinglist = [];
let socket = io();

canvas.width = innerWidth;
canvas.height = innerHeight;

socket.on("connect", () => {

    PlayerId = socket.id
    console.log(PlayerId);

})

let cursors = {};


socket.on("playermoved", ({id, position}) => {

    draworupdatecursor(id, position);

})

function draworupdatecursor(id, position) {

    let cursor = cursors[id];
    if (!cursor) {
        cursor = new playbox(40, 40, position.x, position.y, "#00ff00");
        cursors[id] = cursor;
    } else {

        cursors[id].x = position.x;
        cursors[id].y = position.y;

    }


}

function playbox(width, height, x, y, color) {

    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    ctx.fillStyle = color
    ctx.fillRect(this.x ,this.y, this.width, this.height);


}









function createbox(width, height, x, y, color, vX = 0, vY = 0, velo = 0) {

    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.vX = vX;
    this.vY = vY;
    this.morevelo = velo;
    ctx.fillStyle = color
    ctx.fillRect(this.x ,this.y, this.width, this.height);
    this.update = function(){

        if (spacepressed) this.morevelo = 24;

        ctx.fillStyle = color;
        if (keys.up) {

            this.y = collisionY(this.y, speed, this.morevelo, "minus");
            // this.y -= speed + this.morevelo;
            
        } else if (keys.down) {

            this.y += speed + this.morevelo;
        }

        if (keys.left) {

            this.x -= speed + this.morevelo;

        } else if (keys.right) {

            this.x += speed + this.morevelo;

        }

        spacepressed = false;
        if (this.morevelo > 0) this.morevelo -= 2;
        if (this.morevelo < 0) this.morevelo += 2;

        // boost.up, boost.down, boost.left, boost.right = false;

        ctx.fillRect(this.x, this.y , this.width, this.height);
        const position = {x: this.x, y: this.y};

        if (keys.up || keys.down || keys.left || keys.right) {

            socket.emit("uploadposition", position);

        }

    }

}


function collisionY(position, speed, morespeed, sign) {

    let newposition;

    switch (sign) {
        case "add":
            
            newposition = position + speed + morespeed;
            if (newposition < 0) {
                box.morevelo = box.morevelo - 2 * box.morevelo;
                return position - speed - morespeed;
            } else {
                return newposition;
            }

            break;
    
        case "minus":
            
            newposition = position - speed - morespeed;
            if (newposition < 0) {
                return position + speed + morespeed;
            } else {
                return newposition;
            }

            break;
    }

    // if ()

    this.y -= speed + this.morevelo;

}


function clear() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    box.update();
    thinglist.forEach((id) => {id.update();});

    requestAnimationFrame(clear);

}



let box = new createbox(40, 40, 600, 350, "#00ff00");
// let delay  = setInterval(clear, 10);
clear();



document.addEventListener("keydown", (e) => {

    if (e.code == "Space" || e.code == "ShiftLeft") spacepressed = true;

    if (e.code == "KeyD") {

        keys.right = true;

    } else if (e.code == "KeyA") {

        keys.left = true;

    }
    
    if (e.code == "KeyS") {

        keys.down = true

    } else if (e.code == "KeyW") {

        keys.up = true;

    }


})

document.addEventListener("keyup", (e) => {

    if (e.code == "KeyD") {
        keys.right = false;
    } else if (e.code == "KeyA") {
        keys.left = false;
    }
    
    if (e.code == "KeyS") {
        keys.down = false;
    } else if (e.code == "KeyW") {
        keys.up = false;
    }


})

document.addEventListener("pointerdown", (e) => {


    let playerX = box.x + 0.5 * box.width;
    let playerY = box.y + 0.5 * box.height;

    let delX = e.clientX - playerX;
    let delY = e.clientY - playerY;
    let theta = Math.atan2(delY, delX);


    let js = new projectile(20, 20, playerX, playerY, "#e28743", Math.cos(theta), Math.sin(theta))
    thinglist.push(js);
    

});


function projectile(width, height, x, y, color, vX , vY ) {

    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.vX = vX * 20;
    this.vY = vY * 20;
    ctx.fillStyle = color
    ctx.fillRect(this.x ,this.y, this.width, this.height);
    this.update = function(){

        ctx.fillStyle = color;
        this.x += this.vX;
        this.y += this.vY;

        // boost.up, boost.down, boost.left, boost.right = false;

        ctx.fillRect(this.x, this.y , this.width, this.height);

    }

}

const mydiv = document.getElementById("mydiv");
let offx, offy;
let clicked = false;

mydiv.addEventListener("pointerdown", (e) => {

    clicked = true;
    offx = e.clientX - mydiv.offsetLeft;
    offy = e.clientY - mydiv.offsetTop;

})

document.addEventListener("pointermove", (e) => {

    if (clicked) {
        mydiv.style.left = `${e.clientX - offx}px`;
        mydiv.style.top = `${e.clientY - offy}px`;
    }
})

mydiv.addEventListener("pointerup", () => {
    clicked = false;
})