/* globals console, TweenLite, Power2 */

////////////////
//Variables
////////////////
var game = document.getElementById("game");

var countdownToStart = document.getElementById('countdownToStart'),
	countdownToStartContainer = document.getElementById('countdownToStartContainer'),
	character = document.getElementById('characterContainer');

var gameSeconds = document.getElementById('seconds'),
	gameMilliseconds = document.getElementById('milliseconds');

var tt = TweenLite.to,
	ts = TweenLite.set;

var startGame,
	countToGame = 3,
	gameTime,
	createItemTimer;

var milliseconds = 0,
	seconds = 0;
	//d = new Date(); // will be a more accurate way to display seconds and milliseconds than setInterval

var itemCount = 1;

var itemContainer,
	item,
	item_level = [230, 294, 358];
	
////////////////
//Randomize
////////////////
function randomItemPosition(e){
	console.log('random position');
	var randY = item_level[Math.floor(Math.random() * 3)];
	ts(e, { y: randY });
	tt(e, 4, { x: -2000, delay: 0.15});
	console.log(randY);
}

function createRandomItem(){
	itemContainer = document.createElement('div');
	itemContainer.className = "itemContainer";
	itemContainer.classList.add("item_collision_box");

	item = document.createElement('div');
	item.className = "item" + itemCount;

	itemContainer.appendChild(item);
	game.appendChild(itemContainer);

	randomItemPosition(itemContainer);
	itemCount++;
}

////////////////
//Timers
////////////////
function gameTimer(){
	
	if ( seconds === 10 ){
		clearInterval(gameTime);
		clearInterval(createItemTimer);
		gameMilliseconds.innerHTML = 0;
		return;
	}

	milliseconds += 1;
	gameMilliseconds.innerHTML = milliseconds;
	if( milliseconds >= 9){
		milliseconds = 0;
		seconds += 1;
	}

	gameSeconds.innerHTML = seconds;
}

function startTimer(){
	gameTime = setInterval( gameTimer, 100 );
	createItemTimer = setInterval(createRandomItem, 500);
}

////////////////
//Animations
////////////////
function characterEnter(){
	tt( character, 0.5, { x: 300, ease: Power2.easeIn, delay: 0.5 });
	
	TweenLite.delayedCall( 1.5, startTimer );
}

function jump(){
	tt( character, 0.25, { y: 230, ease: Power2.easeOut });
	tt( character, 0.25, { y: 358, ease: Power2.easeIn, delay: 0.25 });
}

////////////////
//Game Start
////////////////
function countdown(){
	console.log('countdown');
	if(countToGame > 0 ){
		countdownToStart.innerHTML = countToGame;
		countToGame--;
	}else{
		clearInterval(startGame);
		tt([countdownToStart, countdownToStartContainer], 0, { autoAlpha: 0 });
		characterEnter();
		window.addEventListener( "keydown", jump );
	}
}


////////////////
//Initialize
////////////////
function init(){
	ts(character, { x: -220, y: 358 });

	startGame = setInterval(countdown, 1000);
}

window.onload = function(){
	init();
};
