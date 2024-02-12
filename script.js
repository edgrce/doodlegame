let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}

 //physics
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -8;
let gravity = 0.4;

//platfroms
let platfromArray = [];
let platfromWidth = 60;
let platfromHeight = 18;
let platfromImg;

let score = 0;
let maxScore = 0;
let gameOver = false;



window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    doodlerRightImg = new Image();
    doodlerRightImg.src = "./doodler-right.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function() {
       context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./doodler-left.png";

    platfromImg = new Image();
    platfromImg.src = "./greeen_p.png";

    velocityY = initialVelocityY;
    placePlatfroms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    

    //doodler
    doodler.x += velocityX;
    if (doodler.x > boardWidth) {
        doodler.x = 0;
    }
    else if (doodler.x + doodler.width < 0){
        doodler.x = boardWidth;
    }

    velocityY += gravity;
    doodler.y += velocityY;
    if (doodler.y > board.height) {
        gameOver = true;
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    //platfroms
    for (let i = 0; i< platfromArray.length; i++) {
        let platfrom = platfromArray[i];
        if (velocityY < 0 && doodler.y < boardHeight*3/4) {
            platfrom.y -= initialVelocityY; //slide paltfrom down
        }
        if (detectCollision(doodler, platfrom) && velocityY >= 0) {
            velocityY = initialVelocityY;//jump
        }
        context.drawImage(platfrom.img, platfrom.x, platfrom.y, platfrom.width, platfrom.height);
    }

    while (platfromArray.length > 0 && platfromArray[0].y >= boardHeight) {
        platfromArray.shift();
        newPlatfrom();
    }

    //score
    updateScore();
    context.fillStyle = "black";
    context.font = '16px sans-serif';
    
    context.fillText(score, 5,20);

    if(gameOver) {
    context.fillText("Game Over: Press 'space' to restart", boardWidth/7, boardHeight*7/8);
    }
}

function moveDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }

    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }
    else if (e.code == "Space" && gameOver){
        //reset
        doodler = {
            img : doodlerRightImg,
            x : doodlerX,
            y : doodlerY,
            width : doodlerWidth,
            height : doodlerHeight
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatfroms();
    }
}

function placePlatfroms() {
    platfromArray = [];

    //starting platfroms
    let platfrom = {
        img : platfromImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platfromWidth,
        height : platfromHeight
    }

    platfromArray.push(platfrom);

    // platfrom = {
    //     img : platfromImg,
    //     x : boardWidth/2,
    //     y : boardHeight - 150,
    //     width : platfromWidth,
    //     height : platfromHeight
    // }
    // platfromArray.push(platfrom);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4);
        let platfrom = {
            img : platfromImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platfromWidth,
            height : platfromHeight
        }
    
        platfromArray.push(platfrom);
    }
}

function newPlatfrom() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4);
    let platfrom = {
        img : platfromImg,
        x : randomX,
        y : -platfromHeight,
        width : platfromWidth,
        height : platfromHeight
    }

    platfromArray.push(platfrom);
}

function detectCollision(a, b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y + b.y + b.height &&
           a.y + a.height > b.y;

}

function updateScore() {
    let points = Math.floor(50*Math.random());
    if (velocityY < 0) {
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}