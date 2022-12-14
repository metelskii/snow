const mainLayerCanvas = document.getElementById('main-layer');
const mainLayerContext = mainLayerCanvas.getContext('2d', { willReadFrequently: true });
mainLayerContext.fillStyle = 'white';
//var id = ctx.getImageData(0, 0, cvs.width, cvs.height);
//var pixels = id.data;

let gameOver = false;
const snowflakes = [];
let snow = [];
let qnty = 100;
let snowMatrix;
let snowMatrixBack;
const wind = {
    direction: '',
    positionY: 0,
    height: 0,
    force: 0,
    duration: 0
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function initWind() {
    wind.direction = Math.random() < 0.5 ? 'right' : 'left';
    wind.positionY = getRandomInt(50, 100);
    wind.height = getRandomInt(50, 150);
    wind.force = getRandomInt(4, 8);
    wind.duration = getRandomInt(30, 60);
    wind.layer = getRandomInt(0, 1);
}

function initSnowMatrix() {
    snowMatrix = Array.from(Array(301), () => new Array(151).fill(0));
    snowMatrixBack = Array.from(Array(301), () => new Array(151).fill(0));
    for (let i = 0; i <= 300; i++) {
        snowMatrix[i][150] = 1;
        snowMatrixBack[i][150] = 1;
    }
}

function getSnowflakes() {
    for (let i = 0; i < qnty; i++) {
        const snowflake = {
            x: 0,
            y: 0,
            inertion: 0,
            visible: true,
            z: 0
        };
        snowflake.x = Math.floor(Math.random() * cvs.width);
        snowflake.y = Math.floor(Math.random() * cvs.height);
        snowflake.z = getRandomInt(0, 1);        
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
    maxSnow = 150;
    for (let i = 0; i <= 300; i++) {
        for (let j = 0; j <= 150; j++) {
            if (snowMatrixBack[i][j] == 1 && j < maxSnow) {
                maxSnow = j;
            }
        }
    }
    for (let i = 0; i <= 300; i++) {
        for (let j = maxSnow; j <= maxSnow + 10; j++) {
            if (j != 150) {
                snowMatrixBack[i][j] = 0;
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
        if (wind.duration > 0 && snowflake.y > wind.positionY - wind.height / 2 && snowflake.y < wind.positionY + wind.height / 2 && snowflake.z == wind.layer) {
            snowflake.inertion = wind.direction == 'right' ? wind.force : wind.force * -1
            snowflake.x += snowflake.inertion;
        }
        else if (wind.duration == 0 && snowflake.y > wind.positionY - wind.height / 2 && snowflake.y < wind.positionY + wind.height / 2) {
            snowflake.x += snowflake.inertion;
            if (snowflake.inertion > 0) {
                snowflake.inertion -= 1;
            }
        }
        if (snowflake.x < 0) {
            if (snowflake.inertion != 0) {
                snowflake.visible = false;
            }
            else {
                snowflake.x = 0;
                snowflake.inertion = 0;
            }
        }
        else if (snowflake.x > 300) {
            if (snowflake.inertion != 0) {
                snowflake.visible = false;
            }
            else {
                snowflake.x = 300;
                snowflake.inertion = 0;
            }
        }
    }
    snowflake.y += Math.floor(Math.random() * (2 - 1) + 1);
    //if (snowflake.y == cvs.height) {
    if (snowflake.x >= 0 && snowflake.x <= 300 && snowflake.z == 0 && snowMatrix[snowflake.x][snowflake.y] == 1 && snowflake.visible) {
        //insertSnow(snowflake.x, snowflake.y);
        insertSnowMatrix(snowflake.x, snowflake.y, snowMatrix);
        //snowflake.x = Math.floor(Math.random() * cvs.width);
        //snowflake.y = 0;
    }
    else if (snowflake.x >= 0 && snowflake.x <= 300 && snowflake.z == 1 && snowMatrixBack[snowflake.x][snowflake.y] == 1 && snowflake.visible) {
        insertSnowMatrix(snowflake.x, snowflake.y, snowMatrixBack);
    }
    if (snowflake.y == cvs.height) {
        snowflake.x = Math.floor(Math.random() * cvs.width);
        snowflake.y = 0;
        snowflake.inertion = 0;
        snowflake.visible = true;
    }
}

function insertSnowMatrix(x, y, matrix) {
    if (y < 150 && x > 0 && x < 300) {
        if (matrix[x - 1][y] == 1 && matrix[x + 1][y] == 1) {
            matrix[x][y - 1] = 1;
        }
    }
    else if (y < 150 && x == 0) {
        if (matrix[x + 1][y] == 1) {
            matrix[x][y - 1] = 1;
        }
    }
    else if (y < 150 && x == 300) {
        if (matrix[x - 1][y] == 1) {
            matrix[x][y - 1] = 1;
        }
    }
    else {
        matrix[x][y - 1] = 1;
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

    for (let i = 0; i <= 300; i++) {
        for (let j = 0; j <= 150; j++) {
            if (snowMatrixBack[i][j] == 1) {
                //ctx.fillRect(i, j, 1, 1);
                let off = (j * id.width + i) * 4;
                pixels[off] = 211;
                pixels[off + 1] = 211;
                pixels[off + 2] = 211;
                pixels[off + 3] = 255;
            }
        }
    }
    for (let i = 0; i < snowflakes.length; i++) {
        moveSnowflake(snowflakes[i]);
        //ctx.fillRect(snowflakes[i].x, snowflakes[i].y, 1, 1);
        let off = (snowflakes[i].y * id.width + snowflakes[i].x) * 4;
        if (snowflakes[i].visible) {
            pixels[off] = snowflakes[i].z == 0 ? 255 : 211;
            pixels[off + 1] = snowflakes[i].z == 0 ? 255 : 211;
            pixels[off + 2] = snowflakes[i].z == 0 ? 255 : 211;
            pixels[off + 3] = 255;
        }
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
    if (wind.duration > 0) {
        wind.duration -= 1;
    }

    //let time2 = new Date().getTime();
    //console.log((time2 - time1) / 1000 );
}

function checkGameOver() {
    for (let i = 0; i <= 300; i++) {
        for (let j = 0; j <= 150; j++) {
            if (snowMatrix[i][j] == 0 || snowMatrixBack[i][j] == 0) {
                return;
            }
        }
    }
    mainLayerContext.fillStyle = 'black';
    mainLayerContext.font = '30px Changa One';
    mainLayerContext.fillText('Завалило снегом!', 40, 80);
    clearInterval(run);
    gameOver = true;
}

initSnowMatrix();
const run = setInterval(draw, 50);

(function windLoop() {
    var timeout = Math.round(Math.random() * (8000 - 6000) + 6000);
    setTimeout(function() {
        if (gameOver) return;
        initWind();
        windLoop();
    }, timeout);
}());