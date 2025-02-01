import pipeBottom from './images/bottompipe.png';
import birdImg from './images/flappybird.gif';
import pipeTop from './images/toppipe.png';
import BgSound from './jump-sound.mp3';
import './style.css';

const config = {
	width: 360,
	height: 640,
	divRow: 8,
	divCol: 2,
	velocityY: 0,
	gravity: 0.2,
	velocityX: -2,
};

let gameOver = false;
let context = null;
let score = 0;

// 408 // 228
const bird = {
	img: new Image(),
	width: 34,
	height: 19,
	x: config.width / config.divRow,
	y: config.height / config.divCol,
};

// 384 / 3072
const pipe = {
	img: {
		top: new Image(),
		bottom: new Image(),
	},
	width: 64,
	height: 512,
	x: config.width,
	y: 0,
	passed: false,
};

const pipeList = [];

let animId = null;
let startTime = 0;
const interval = 1500;
const SOUND = new Audio(BgSound);

const placePipe = () => {
	const space = pipe.height / 4;
	const randomY = pipe.y - pipe.height / 4 - Math.random() * (pipe.height / 2);

	const topPipe = {
		...pipe,
		img: pipe.img.top,
		y: randomY,
	};

	pipeList.push(topPipe);

	const bottomPipe = {
		...pipe,
		img: pipe.img.bottom,
		y: pipe.height + space + randomY,
	};

	pipeList.push(bottomPipe);
};

const detectedCollision = (bird, pipe) => {
	return (
		bird.x < pipe.x + pipe.width &&
		bird.x + bird.width > pipe.x &&
		bird.y < pipe.y + pipe.height &&
		bird.y + bird.height > pipe.y
	);
};

const update = (timestamp) => {
	animId = requestAnimationFrame(update);

	if (!animId) animId = timestamp;

	const elapsedTime = timestamp - startTime;

	if (elapsedTime >= interval) {
		placePipe();
		startTime = timestamp;
	}

	context.clearRect(0, 0, config.width, config.height);

	// bird
	config.velocityY += config.gravity;

	bird.y = Math.max(bird.y + config.velocityY, 0);
	context.drawImage(bird.img, bird.x, bird.y, bird.width, bird.height);

	// gameOver
	if (bird.y + bird.height >= config.height) {
		gameOver = true;
	}

	pipeList.forEach((pipe) => {
		pipe.x += config.velocityX;

		if (!pipe.passed && bird.x > pipe.x + pipe.width) {
			score += 0.5;
			pipe.passed = true;
		}

		if (detectedCollision(bird, pipe)) {
			gameOver = true;
		}

		context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
	});

	while (pipeList.length && pipeList[0].x < -pipe.width) {
		pipeList.shift();
	}

	context.fillStyle = 'white';
	context.font = '45px sans-serif';
	context.fillText(score, 5, 45);

	if (gameOver) {
		cancelAnimationFrame(animId);
		animId = null;
		context.fillText('Game Over', 5, 90);
		return;
	}
};

const moveBird = (e) => {
	if (gameOver && e.code === 'Enter') {
		console.log('game over moveBird');
		bird.y = config.height / config.divCol;
		score = 0;
		pipeList.length = 0;
		gameOver = false;
		update();
	}

	if (!gameOver && e.code !== 'Space') return;

	// sound
	SOUND.play();
	config.velocityY = -4;
};

const init = () => {
	const board = document.querySelector('#board');
	board.width = config.width;
	board.height = config.height;

	context = board.getContext('2d');

	// bird
	bird.img.src = birdImg;
	bird.img.addEventListener('load', () => {
		context.drawImage(bird.img, bird.x, bird.y, bird.width, bird.height);
	});

	pipe.img.top.src = pipeTop;
	pipe.img.top.addEventListener('load', () => {
		context.drawImage(pipe.img.top, bird.x, 0, pipe.width, pipe.height);
	});
	pipe.img.bottom.src = pipeBottom;
	pipe.img.bottom.addEventListener('load', () => {
		context.drawImage(
			pipe.img.bottom,
			bird.x + 100,
			config.height - pipe.height,
			pipe.width,
			pipe.height
		);
	});

	requestAnimationFrame(update);

	document.addEventListener('keydown', moveBird);
};

window.addEventListener('load', init);
