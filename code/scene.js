/* globals TweenLite, console */
var scene = function(){
	var skyline_bg = document.getElementById("skyline_bg"),
		skyline_fg = document.getElementById("skyline_fg"),
		ground = document.getElementById("ground"),
		fg_pos = 0,
		bg_pos = 0,
		ground_pos = 0;

	var tt = TweenLite.to;

	setInterval(function(){ 
		bg_pos -= 2;
		fg_pos -= 4;
		ground_pos -= 6;
		tt(skyline_fg, 0.1, { backgroundPosition : fg_pos+'px bottom' });
		tt(skyline_bg, 0.1, { backgroundPosition : bg_pos+'px bottom' });
		tt(ground, 0.1, { backgroundPosition : ground_pos+'px bottom' });
	}, 60);
	console.log("SCENE INITIALIZED");
};

scene();