const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d', { willReadFrequently: true });
ctx.fillStyle = 'white';
//var id = ctx.getImageData(0, 0, cvs.width, cvs.height);
//var pixels = id.data;

const snowflakes = [];
let snow = [];
let qnty = 100;
let snowMatrix = Array.from(Array(900), () => new Array(600));

function initSnowMatrix() {
    for (let i = 0; i <= 300; i++) {
        for (let j = 0; j <= 150; j++) {
            snowMatrix[i][j] = 0;
        }
        snowMatrix[i][149] = 1;
    }
}

function getSnowflakes() {
    for (let i = 0; i < qnty; i++) {
        const snowflake = {
            x: 0,
            y: 0
        };
        snowflake.x = Math.floor(Math.random() * cvs.width);
        snowflake.y = Math.floor(Math.random() * cvs.height);
        // snowflake.y = 0;
        snowflakes.push(snowflake);
    }
}

function clearSnow() {
    //let maxSnow = 600;
    let maxSnow = 150;
    // snow.forEach(s => {
    //     if (s.y < maxSnow) maxSnow = s.y;
    // });
    // const clearedSnow = snow.filter(s => s.y > maxSnow + 10);
    // snow = clearedSnow;
    for (let i = 0; i <= 300; i++) {
        for (let j = 0; j <= 150; j++) {
            if (snowMatrix[i][j] == 1 && j < maxSnow) {
                maxSnow = j;
            }
        }
    }
    for (let i = 0; i <= 300; i++) {
        for (let j = maxSnow; j <= maxSnow + 10; j++) {
            if (j != 149) {
                snowMatrix[i][j] = 0;
            }
        }
    }
}

function moreSnow() {
    qnty += 100;
    getSnowflakes();
}

function moveSnowflake(snowflake) {
    if (Math.random() < 0.5) {
        snowflake.x += Math.random() < 0.5 ? -1 : 1;
        if (snowflake.x < 0) {
            snowflake.x = 0;
        }
        else if (snowflake.x > 300) {
            snowflake.x = 300;
        }
    }
    snowflake.y += Math.floor(Math.random() * (2 - 1) + 1);
    //if (snowflake.y == cvs.height) {
    if (snowMatrix[snowflake.x][snowflake.y] == 1) {
        //insertSnow(snowflake.x, snowflake.y);
        insertSnowMatrix(snowflake.x, snowflake.y);
        //snowflake.x = Math.floor(Math.random() * cvs.width);
        //snowflake.y = 0;
    }
    if (snowflake.y == cvs.height) {
        snowflake.x = Math.floor(Math.random() * cvs.width);
        snowflake.y = 0;
    }
}

function insertSnowMatrix(x, y) {
    if (y < 148 && x > 0 && x < 300) {
        if (snowMatrix[x - 1][y] == 1 && snowMatrix[x + 1][y] == 1) {
            snowMatrix[x][y - 1] = 1;
        }
    }
    else if (y < 148 && x == 0) {
        if (snowMatrix[x + 1][y] == 1) {
            snowMatrix[x][y - 1] = 1;
        }
    }
    else if (y < 148 && x == 300) {
        if (snowMatrix[x - 1][y] == 1) {
            snowMatrix[x][y - 1] = 1;
        }
    }
    else {
        snowMatrix[x][y - 1] = 1;
    }
}

function insertSnow(x, y) {
    for (let i = 0; i < snow.length; i++) {
        if (snow[i].x == x) {
            y = snow[i].y - 1;
        }
    }
    snow.push({ x: x, y: y});
}

function draw() {    
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    let id = ctx.getImageData(0, 0, cvs.width, cvs.height);
    let pixels = id.data;

    //let time1 = new Date().getTime();

    for (let i = 0; i < snowflakes.length; i++) {        
        moveSnowflake(snowflakes[i]);
        //ctx.fillRect(snowflakes[i].x, snowflakes[i].y, 1, 1);
        let off = (snowflakes[i].y * id.width + snowflakes[i].x) * 4;
        pixels[off] = 255;
        pixels[off + 1] = 255;
        pixels[off + 2] = 255;
        pixels[off + 3] = 255;
    }
    // for (let j = 0; j < snow.length; j++) {
    //     ctx.fillRect(snow[j].x, snow[j].y, 1, 1);
    // }
    for (let i = 0; i <= 300; i++) {
        for (let j = 0; j <= 150; j++) {
            if (snowMatrix[i][j] == 1) {
                //ctx.fillRect(i, j, 1, 1);
                let off = (j * id.width + i) * 4;
                pixels[off] = 255;
                pixels[off + 1] = 255;
                pixels[off + 2] = 255;
                pixels[off + 3] = 255;
            }
        }
    }
    ctx.putImageData(id, 0, 0);

    //let time2 = new Date().getTime();
    //console.log((time2 - time1) / 1000 );
}

initSnowMatrix();
const run = setInterval(draw, 50);