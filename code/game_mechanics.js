/* globals console, scene, TweenLite, Linear, Power2, Circ */

////////////////
//Variables
////////////////
var container = document.getElementById("container"),
	game = document.getElementById("game"),
	points = document.getElementById('points'),
	button_start = document.getElementById('button_start'),
	container_message = document.getElementById("container_message"),
	score_final = document.getElementById("score_final");

var countdownToStart = document.getElementById('countdownToStart'),
	countdownToStartContainer = document.getElementById('countdownToStartContainer'),
	characterContainer = document.getElementById('characterContainer'),
	character = document.getElementById("character");

var gameSeconds = document.getElementById('seconds'),
	gameMilliseconds = document.getElementById('milliseconds');

var button_sound = document.getElementById("button_sound"),
	sound_bg = document.getElementById("sound_bg"),
	sound_collect = document.getElementById("sound_collect"),
	sound_countdown = document.getElementById("sound_countdown"),
	sound_win = document.getElementById("sound_win"),
	sound_jump = document.getElementById("sound_jump");

var sound_array = [sound_bg, sound_collect, sound_countdown, sound_win, sound_jump];

var tt = TweenLite.to,
	ts = TweenLite.set;

var startGame,
	countToGame = 3,
	gameTime,
	createItemTimer;

var milliseconds = 0,
	seconds = 20;

var itemCount = 1;

var itemContainer,
	item,
	item_level = [230, 294, 358];

//character position 
var character_left, character_top;

var score = 0;

var fw_count = 0,
	fw_colors = ["26deff", "27fe27", "ef3039"],
	container_fireworks = document.getElementById("container_fireworks"),
	fw_template = document.querySelectorAll(".fw_template")[0],
	x_distance_1 = 0,
	x_distance_2 = 0,
	scene_timer;

var isEndFrame = false,
	character_end,
	end_frame_start,
	final_score = 0,
	final_score_up = 0,
	final_score_down = 0,
	score_countdown;
	
////////////////
//Randomize
////////////////
function randomItemPosition(e){
	var randY = item_level[Math.floor(Math.random() * 3)];
	ts(e, { y: randY });
	tt(e, 1.5, { x: -(container.clientWidth + itemContainer.clientWidth), delay: 0.15, ease: Linear.easeNone, onComplete: function(){
		e.style.display = "none";
	}});
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
//Create Fireworks
////////////////
function create_firework(){
	fw_count++;
	if ( !isEndFrame ) {
		x_distance_1 = -10;
		x_distance_2 = -5;
	} else {
		x_distance_1 = 0;
		x_distance_2 = 0;
	}
	
	var create_fw = fw_template.cloneNode(true),
		y_random = Math.floor(Math.random()* container.clientHeight),
		fw_pixel = create_fw.querySelectorAll(".fw_pixel")[0],
		fw_img = create_fw.querySelectorAll(".fw_img")[0],
		fw_color = fw_colors[Math.floor(Math.random()*3)];

	create_fw.id = "fw_"+fw_count;
	fw_pixel.style.backgroundColor = "#"+fw_color;
	
	container_fireworks.appendChild(create_fw);
	create_fw.style.left = Math.random() * container.clientWidth + "px";
	tt(create_fw, ((Math.random()*3)), { x: x_distance_1, y: -y_random, scale: ((Math.random()*3)+1 ), ease: Circ.easeOut, onComplete: function(){ 
		tt(fw_img, 2, { x: x_distance_2 });
		ts(fw_img, { display : "block" });
		fw_img.src = "img/firework_"+fw_color+".gif?"+Math.random();
		tt(fw_pixel, 0.1, { autoAlpha: 0 });
		tt(create_fw, 0.4, { autoAlpha: 0, delay: 1, onComplete: function(){ 
			container_fireworks.removeChild(create_fw);
			if ( isEndFrame ){
				create_firework();
			}
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

				if( gift_left >= character_left && gift_left <= (character_left + 64) ){
					if ( gift_top >= character_top && gift_top <= (character_top + 64 )) {
						sound_collect.currentTime = 0.1;
						sound_collect.play();
						score++;
						points.innerHTML = score;

						game.removeChild(gifts[i]);
						create_firework();
						console.log("SCORE: " + score);
					}
				}
			}
	}
}

//+++++++++++++++++++++++++++
// END SCENE 
//+++++++++++++++++++++++++++
function score_reverse(){
	ts(score_final, { autoAlpha: 1 });
	if( final_score < score ){
		score -= 1;
		final_score_up += 1;
		final_score_down = score;
		create_firework();

		score_final.innerHTML = final_score_up;
		points.innerHTML = final_score_down;
		sound_win.currentTime = 0.1;
		sound_win.play();
	} else {
		clearInterval(score_countdown);
	}
}

function jump_end(){
	tt( characterContainer, 0.5, { y: 310, ease: Power2.easeOut, delay: 0 });
	tt( characterContainer, 0.5, { y: 358, ease: Power2.easeIn, delay: 0.50 });
}

function end_frame_start(){
	isEndFrame = true;

	tt(characterContainer, 0.4, { x: container.clientWidth/2 - 104, y: 358 });
	character.className = "jump";
	clearInterval(scene_timer);
	score_countdown = setInterval(score_reverse, 2000/score);

	window.removeEventListener( "keydown", jump );
	container.removeEventListener("touchstart", jump);

	tt(container_message, 0.4, { autoAlpha: 1 });
	character_end = setInterval( jump_end, 1000 );
}

////////////////
//Timers
////////////////
function gameTimer(){
	
	if ( seconds <= 0 ){
		clearInterval(gameTime);
		clearInterval(createItemTimer);
		setTimeout(end_frame_start, 3000);
		gameMilliseconds.innerHTML = 0;
		return;
	}

	milliseconds -= 1;
	if( milliseconds < 0 ){
		milliseconds = 9;
		seconds -= 1;
	}
	gameMilliseconds.innerHTML = milliseconds;

	if ( seconds < 10 ) { 
		gameSeconds.innerHTML = "0" + seconds;
	} else{
		gameSeconds.innerHTML = seconds;
	}
}

function startTimer(){
	gameTime = setInterval( gameTimer, 100 );
	createItemTimer = setInterval(createRandomItem, 300);
}

////////////////
//Animations
////////////////
function characterEnter(){
	tt( characterContainer, 1, { x: ((container.clientWidth/2) - 64), ease: Power2.easeIn, delay: 0.5 });
	
	TweenLite.delayedCall( 1.5, startTimer );
}

function jump(){
	sound_jump.currentTime = 0.1;
	sound_jump.play();
	character.className = "jump";
	tt( characterContainer, 0.25, { y: 200, ease: Power2.easeOut, delay: 0 });
	tt( characterContainer, 0.25, { y: 358, ease: Power2.easeIn, delay: 0.25, onComplete: function(){
		character.className = "";
	} });
}

//Move chartacter on resize amnd orientation change
function character_position(){
	var character_y;
	if ( isEndFrame ) {
		character_y = 104;
	} else {
		character_y = 64;
	}
	tt(characterContainer, 0.3, { x: (container.clientWidth/2 - character_y) });

	ts(countdownToStart, { x:(container.clientWidth / 2) - (countdownToStart.clientWidth / 2)  });
	ts(countdownToStart, { y:(container.clientHeight / 2) - (countdownToStart.clientHeight / 2)  });
}

////////////////
//In Game Mechanics
////////////////
function inGame(){
	clearInterval(startGame);
	
	ts([countdownToStart, countdownToStartContainer], { autoAlpha: 0 });
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
		sound_countdown.currentTime = 0.1;
		sound_countdown.play();
		countdownToStart.innerHTML = countToGame;
		countToGame--;
	}else{
		inGame();
	}
}

function game_start(){
	seconds = 20;
	milliseconds = 0;
	countToGame = 3;
	isEndFrame = false;
	clearInterval(character_end);
	final_score = 0;
	score = 0;
	final_score_up = 0;
	ts(score_final, { autoAlpha: 0 });
	ts([countdownToStart, countdownToStartContainer], { autoAlpha: 1 });

	tt(container_message, 0.4, { autoAlpha: 0 });
	character_position();
	character.className = "";
	startGame = setInterval(countdown, 1000);
	scene_timer = setInterval(scene.scene_move, 50 );
}

//++++++++++++++++++++++++
// SOUND 
//++++++++++++++++++++++++
var isSound = true;
function sound_handler(){
	console.log("isSound = " +isSound);
	if ( isSound === true ){
		for ( var i = 0; i < sound_array.length; i++ ){
			sound_array[i].volume = 0;
			isSound = false;
			button_sound.style.opacity = 0.5;
		}
	} else {
		for ( var i = 0; i < sound_array.length; i++ ){
			sound_array[i].volume = 1;
			isSound = true;
			button_sound.style.opacity = 1;
		}
	}
}
////////////////
//Initialize
////////////////
function replay(){
	if (sound_bg.currentTime >= 6.5 ) {
		sound_bg.currentTime = 0.25;
		sound_bg.play();
	}
}
function init(){
	ts(characterContainer, { x: container.clientWidth/2 - 104, y: 358 });
	sound_bg.play();
	sound_bg.addEventListener('timeupdate', replay);
}

window.addEventListener("resize", character_position); 
window.onload = init;
button_start.addEventListener("click", game_start);
button_sound.addEventListener("click", sound_handler);
