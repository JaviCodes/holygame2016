/* globals console, TweenLite, Power2 */

////////////////
//Variables
////////////////
var container = document.getElementById("container"),
	game = document.getElementById("game"),
	points = document.getElementById('points');

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

var fw_count = 0,
	fw_colors = ["26deff", "27fe27", "ef3039"],
	fw_template = document.querySelectorAll(".fw_template")[0];
	
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
//Create Fireworks
////////////////
function create_firework(){
	fw_count++;
	
	var create_fw = fw_template.cloneNode(true),
		y_random = Math.floor(Math.random()* container.clientHeight),
		fw_pixel = create_fw.querySelectorAll(".fw_pixel")[0],
		fw_img = create_fw.querySelectorAll(".fw_img")[0],
		fw_color = fw_colors[Math.floor(Math.random()*3)];

	create_fw.id = "fw_"+fw_count;
	fw_pixel.style.backgroundColor = "#"+fw_color;
	
	container_fireworks.appendChild(create_fw);
	create_fw.style.left = Math.random() * container.clientWidth + "px";
	tt(create_fw, ((Math.random()*3)), { y: -y_random, scale: ((Math.random()*3)+1 ), ease: Circ.easeOut, onComplete: function(){ 

		ts(fw_img, { display : "block" });
		fw_img.src = "img/firework_"+fw_color+".gif?"+Math.random();
		tt(fw_pixel, 0.1, { autoAlpha: 0 });
		tt(create_fw, 0.4, { autoAlpha: 0, delay: 1, onComplete: function(){ 
			container_fireworks.removeChild(create_fw);
		}});
	}});	
}

////////////////
//Collision Detection
////////////////

function get_character_position(){
	var char_position = character.getBoundingClientRect();

		character_left = Math.round(char_position.left);
		character_top = Math.round(char_position.top);
}

function get_item_positions(){
	if( container.querySelectorAll('.itemContainer') ){
		var gifts = container.querySelectorAll('.itemContainer');
		var gift_position, gift_left, gift_top;

			for(var i = 0; i < gifts.length; i++){
				gift_position = gifts[i].getBoundingClientRect();
				
				gift_left = Math.round(gift_position.left);
				gift_top = Math.round(gift_position.top);

				if( ( gift_left - character_left ) >= 0 && ( gift_left - character_left ) <= 5  ){
					score++;
					points.innerHTML = score;

					game.removeChild(gifts[i]);
					create_firework();
					console.log("SCORE: " + score);
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
//In Game Mechanics
////////////////
function inGame(){
	clearInterval(startGame);
	
	tt([countdownToStart, countdownToStartContainer], 0, { autoAlpha: 0 });
	characterEnter();
	
	window.addEventListener( "keydown", jump );
	container.addEventListener("touchstart", jump);

	setInterval( get_character_position,  10);
	setInterval( get_item_positions,  10);
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
		inGame();
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
