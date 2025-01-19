// board
let board;
const boardWidth = 360;
const boardHeight = 640;
let context;

// bird
const birdWidth = 34; // width / height ratio = 408 / 228 = 17 / 12
const birdHeight = 24;
const birdX = boardWidth / 8;
const birdY = boardHeight / 2;
let birdImg;

const bird = {
	x: birdX,
	y: birdY,
	width: birdWidth,
	height: birdHeight,
};

// pipe
const pipeArray = [];
const pipeWidth = 64;
const pipeHeight = 512;
const pipeX = boardWidth;
const pipeY = 0;

let topPipeImg;
let bottomPipeImg;

const placePipes = () => {
	if (gameOver) return;
	// 0 - 512 / 4 - 0 * (512 / 2)
	const randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
	const openingSpace = board.height / 4;

	const topPipe = {
		img: topPipeImg,
		x: pipeX,
		y: randomPipeY,
		width: pipeWidth,
		height: pipeHeight,
		passed: false,
	};

	pipeArray.push(topPipe);

	const bottomPipe = {
		img: bottomPipeImg,
		x: pipeX,
		y: randomPipeY + pipeHeight + openingSpace,
		width: pipeWidth,
		height: pipeHeight,
		passed: false,
	};

	pipeArray.push(bottomPipe);
};

// physics
const velocityX = -2; // pipes moving left speed;
let velocityY = 0; // bird jump speed
let gravity = 0.4;
let gameOver = false;

const update = () => {
	requestAnimationFrame(update);
	if (gameOver) return;

	context.clearRect(0, 0, board.width, board.height);

	// bird
	velocityY += gravity;
	// bird.y += velocityY;
	bird.y = Math.max(bird.y + velocityY, 0); // apply gravity to current bird.y, limit the bird.y to top of the canvas.
	context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

	// pipes
	for (let i = 0; i < pipeArray.length; i += 1) {
		const pipe = pipeArray[i];

		pipe.x += velocityX;
		context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

		if (detectCollision(bird, pipe)) {
			gameOver = true;
		}
	}
};

const detectCollision = (a, b) => {
	return (
		a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y
	);
};

const moveBird = (e) => {
	if (e.code !== 'Space') return;
	// jump
	velocityY = -6;
};

const init = () => {
	board = document.querySelector('#board');
	board.width = boardWidth;
	board.height = boardHeight;
	context = board.getContext('2d');

	// draw flappy bird
	// context.fillStyle = 'green';
	// context.fillRect(bird.x, bird.y, bird.width, bird.height);

	// load image
	birdImg = new Image();
	birdImg.src = './assets/images/flappybird.gif';
	birdImg.addEventListener('load', () => {
		context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
	});

	topPipeImg = new Image();
	topPipeImg.src = './assets/images/toppipe.png';

	bottomPipeImg = new Image();
	bottomPipeImg.src = './assets/images/bottompipe.png';

	requestAnimationFrame(update);
	setInterval(placePipes, 1500);
	document.addEventListener('keydown', moveBird);
};

window.addEventListener('load', init);
