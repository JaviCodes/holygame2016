/* globals TweenLite */

var scene = (function(){
	var skyline_bg = document.getElementById("skyline_bg"),
		skyline_fg = document.getElementById("skyline_fg"),
		ground = document.getElementById("ground"),
		fg_pos = 0,
		bg_pos = 0,
		ground_pos = 0,
		tt = TweenLite.to,
		scene_move = function(){
			bg_pos -= 2;
			fg_pos -= 4;
			ground_pos -= 6;
			tt(skyline_fg, 0.1, { backgroundPosition : fg_pos+'px bottom' });
			tt(skyline_bg, 0.1, { backgroundPosition : bg_pos+'px bottom' });
			tt(ground, 0.1, { backgroundPosition : ground_pos+'px bottom' });			
		}

		return { scene_move: scene_move };
	}
());
