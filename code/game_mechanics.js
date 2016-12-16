/* globals console, TweenLite, Power2 */

////////////////
//Variables
////////////////
var container = document.getElementById("container"),
	game = document.getElementById("game");

var countdownToStart = document.getElementById('countdownToStart'),
	countdownToStartContainer = document.getElementById('countdownToStartContainer'),
	characterContainer = document.getElementById('characterContainer'),
	character = document.getElementById("character");

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

var game_sequence = true;

//character position 
var character_left, character_top;
var gif_left, gift_top;

var items = [];

var score = 0;
	
////////////////
//Randomize
////////////////
function randomItemPosition(e){
	// console.log('random position');
	var randY = item_level[Math.floor(Math.random() * 3)];
	ts(e, { y: randY });
	tt(e, 4, { x: -2000, delay: 0.15});
	// console.log(randY);
}

function createRandomItem(){
	var item_position;

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
//Collision Detection
////////////////

function get_character_position(){
	var char_position = character.getBoundingClientRect();

		character_left = Math.round(char_position.left);
		character_top = Math.round(char_position.top);

		// console.log( "Character Left " + character_left );
		// console.log( "Character Top " + character_top );
}

function get_item_positions(){
	if( container.querySelectorAll('.itemContainer') ){
		var gifts = container.querySelectorAll('.itemContainer');
		var gift_position, gift_left, gift_top;

			for(var i = 0; i < gifts.length; i++){
				gift_position = gifts[i].getBoundingClientRect();
				
				gift_left = Math.round(gift_position.left);
				gift_top = Math.round(gift_position.top);
				
				// console.log(gift_left);

				console.log ( character_left - gift_left );

				if( (character_top - gift_top) <= 5 && (character_left - gift_left) <= 5 ){
					score++;
					console.log("SCOOOOOOOOOORE!!!!!!!!!!! " + score);
				}
			}
	}
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
	tt( characterContainer, 1, { x: ((container.clientWidth/2) - 64), ease: Power2.easeIn, delay: 0.5 });
	
	TweenLite.delayedCall( 1.5, startTimer );
}

function jump(){
	tt( characterContainer, 0.25, { y: 230, ease: Power2.easeOut });
	tt( characterContainer, 0.25, { y: 358, ease: Power2.easeIn, delay: 0.25 });
}

//Move chartacter on resize amnd orientation change
function character_position(){
	tt(characterContainer, 0.3, { x: (container.clientWidth/2 - 64) });
}
window.addEventListener("resize", character_position);

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
		container.addEventListener("touchstart", jump);

		setInterval( get_character_position,  100);
		setInterval( get_item_positions,  100);
	}
}

////////////////
//Initialize
////////////////
function init(){
	ts(characterContainer, { x: -(container.clientWidth/2 - 64), y: 358 });

	startGame = setInterval(countdown, 1000);
}

window.onload = function(){
	init();
};
