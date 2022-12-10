const mainLayerCanvas = document.getElementById('main-layer');
const mainLayerContext = mainLayerCanvas.getContext('2d', { willReadFrequently: true });
mainLayerContext.fillStyle = 'white';
//var id = ctx.getImageData(0, 0, cvs.width, cvs.height);
//var pixels = id.data;

const MIN_X = 0;
const MAX_X = 300;

const snowflakes = [];
let snow = [];
let qnty = 100;
let snowMatrix;

function initSnowMatrix() {
    snowMatrix = Array.from(Array(301), () => new Array(151).fill(0));
    for (let i = 0; i <= 300; i++) {
        snowMatrix[i][150] = 1;
    }
}

function getSnowflakes() {
    for (let i = 0; i < qnty; i++) {
        const snowflake = { x: 0, y: 0 };
        snowflake.x = Math.floor(Math.random() * mainLayerCanvas.width);
        snowflake.y = Math.floor(Math.random() * mainLayerCanvas.height);
        //snowflake.y = 0;
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
            if (j != 150) {
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
        if (snowflake.x < MIN_X) {
            snowflake.x = MIN_X;
        }
        else if (snowflake.x > MAX_X) {
            snowflake.x = MAX_X;
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
    if (snowflake.y == mainLayerCanvas.height) {
        snowflake.x = Math.floor(Math.random() * mainLayerCanvas.width);
        snowflake.y = 0;
    }
}

function insertSnowMatrix(x, y) {
    if (y < 150 && x > 0 && x < 300) {
        if (snowMatrix[x - 1][y] == 1 && snowMatrix[x + 1][y] == 1) {
            snowMatrix[x][y - 1] = 1;
        }
    }
    else if (y < 150 && x == 0) {
        if (snowMatrix[x + 1][y] == 1) {
            snowMatrix[x][y - 1] = 1;
        }
    }
    else if (y < 150 && x == 300) {
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
    snow.push({ x: x, y: y });
}

function draw() {
    mainLayerContext.clearRect(0, 0, mainLayerCanvas.width, mainLayerCanvas.height);
    let id = mainLayerContext.getImageData(0, 0, mainLayerCanvas.width, mainLayerCanvas.height);
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
    mainLayerContext.putImageData(id, 0, 0);
    checkGameOver();

    //let time2 = new Date().getTime();
    //console.log((time2 - time1) / 1000 );
}

function checkGameOver() {
    for (let i = 0; i <= 300; i++) {
        for (let j = 0; j <= 150; j++) {
            if (snowMatrix[i][j] == 0) {
                return;
            }
        }
    }
    mainLayerContext.fillStyle = 'black';
    mainLayerContext.font = '30px Changa One';
    mainLayerContext.fillText('Завалило снегом!', 40, 80);
    clearInterval(run);
}

initSnowMatrix();
const run = setInterval(draw, 50);