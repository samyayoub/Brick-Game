var canvas = document.querySelector("#myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

// Variables for bricks
var brickRowCount = 3;
var brickColumnCount = 7;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;

// Creating the bricks array
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Function to draww the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath();
}

// Function to draw all the bricks
function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                // Create each brick accordding to the given # of columns, rows and their sizes
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "green";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Function to draw the paddle controlled by user
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

// Function to check whenever button is pressed
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

// Function to check whenever button is released
function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

// Function to check for collision
function collisionDetector() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var brickObject = bricks[c][r];

            // Checking if the block is visible or not; if visible then change direction, change it invisible and increase score
            if (brickObject.status === 1) {
                if (x > brickObject.x && x < brickObject.x + brickWidth && y > brickObject.y && y < brickObject.y + brickHeight) {
                    dy = -dy;
                    brickObject.status = 0;
                    score++;

                    // Alert winning if all bricks are cleared
                    if (score == brickRowCount * brickColumnCount) {
                        alert("You did it. Congrats!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

// Function to draw the score
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

// Function to draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawBricks();
    drawPaddle();
    drawScore();

    collisionDetector();

    // Check if ball hits the left or right walls. If ball hits, then it will switch direction.
    if ((x + ballRadius) > canvas.width || (x - ballRadius) < 0) {
        dx = -dx
    }

    // Check if ball hits top wall. If ball hits, then it will switch direction.
    if ((y - ballRadius) < 0) {
        dy = -dy;
    } else if ((y + ballRadius) > canvas.height) {
        // Check if ball hits paddle.
        if (x > paddleX && x < (paddleX + paddleWidth)) {
            dy = -dy;
        }
        // End game if ball misses the paddle (hits the bottom wall)
        else {
            document.location.reload();
            clearInterval(interval); //Needed for Chrome to end game
        }
    }

    x += dx;
    y += dy;

    // check for buttons pressed and move paddle accordingly
    if (rightPressed) {
        paddleX += 5;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if (leftPressed) {
        paddleX -= 5;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }
}

// Event listeners to the buttons
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var interval = setInterval(draw, 10);