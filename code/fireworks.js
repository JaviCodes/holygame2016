/* globals TweenLite, Circ */

var container = document.getElementById("container"),
	container_fireworks = document.getElementById("container_fireworks"),
	fw_template = document.querySelectorAll(".fw_template")[0];

var tt = TweenLite.to,
	ts = TweenLite.set;

var fw_count = 0,
	fw_colors = ["26deff", "27fe27", "ef3039"];

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

setInterval(create_firework, 500);