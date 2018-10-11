(function() {
	"use strict";
	const FRAME_PATH = "images/compressed/"
	const GIF_PATH = "assets/gifs/"
	const OTHER_PATH = ""
	const AUDIO_PATH = "assets/audio/"
	const BOX_PATH = "assets/boxes/"
	const INVENTORY_PATH = "assets/inventory/"

	const HEIGHT = 600;
	const WIDTH = 800;
	const SIDE_SPEED = 200;
	const FADE_SPEED = 1000;

	var power = false;
	var processes = 0; //whether not to listen to user input
	var startFrame = 1;
	var frame = 1;
	var key = 0;
	var lever = 0;

	window.onload = function() {
		initModel();
		initController();
		initView();
	};

//MODEL DATA
const frames = { 
	1:{//1
		left: 2
	},2:{//2
		forward: 3, right: 1
	},3:{//3
		forward:4, back: 2
	},4:{//4
		back: 3
	},5:{//5
		forward: 6, back: 4
	},6:{//6
		forward: 7, back: 5
	},7:{//7
		back: 6
	},8:{//8
		forward: 9, back: 4
	},9:{//9
		forward: 10, back: 8
	},10:{//10
		forward: 11, back: 9
	},11:{//11
		back: 10
	}
}

const inventory = 
["key", "b", "c"]


//CONTROL DATA
const boxes = {
	standard: {
		left: {
			pos: [0, .2, .2, .6],
			transition: "left",
			cursor: "left"
		},
		right: {
			pos: [.8, .2, .2, .6],
			transition: "right",
			cursor: "right"
		},
		forward: {
			pos: [.25, .5, .25, .5],
			transition: "fade",
			cursor: "forward"
		},
		back: {
			pos: [0, 1, .8, .2],
			transition: "fade",
			cursor: "back"
		}
	},
	custom: {
		4: [{	pos: [.4, .1, .8, .2],
				cursor: "forward",
				addListeners: function(box) {
					box.onclick = ()=>{
						transition(5, "fade");
					};
				}},
				{	pos: [.6, .9, .2, .8],
				cursor: "forward",
				addListeners: function(box) {
					box.onclick = ()=>{
						transition(8, "fade");
					};
				}}
			],

	}
		
}

//******************************************
//*****************MODEL********************
//******************************************
	function initModel() {
		//initSounds();
	}

	function initSounds() {
		var rain = playSound("outsiderain", 0, true);
		var generator = playSound("reddit", .5, true);
		json.sounds.rain = rain;
		json.sounds.rain.volume = 0;
		rain.volume = .2;
		for (var i = 0; i < 999; i++) {
			json.sounds.rain.volume += .001;
		}
	}

	function setVolume(n, volume, speed) {
		//	json.sounds.n.volume = volume;
	}



//******************************************
//*****************CONTROLLER***************
//******************************************


var inventoryMap = {
	key: {
		img: "burger"
	}
}

	function initController() {
		updateInventory();
	}

	//processess and updates boxes, based on the given frame
	function updateBoxes(newFrame) {
		console.log(newFrame);
		clearCustomBoxes();
		frame = newFrame;

		updateStandardBoxes(newFrame);
		var boxesData = boxes.custom[frame];
		if (boxesData != null) {			//creates custom boxes
			for (var i = 0; i < boxesData.length; i++) {
				makeCustomBox(boxesData[i]);
			}
		}
	}

	function updateInventory(){
		for (var i = 0; i < inventory.length; i++){
			var box = document.createElement("div");
			box.classList.add("inventory");
			box.classList.add("box");
			box.classList.add(inventory[i])
			box.id = inventory[i]
			box.style.left = "0px";
			box.style.top = "0px";
			var img = document.createElement("img");
			//imd.src = INVENTORY_PATH + ""
			makeDraggable(box);
			getById("inventory").appendChild(box);
		}
	}

	function makeDraggable(box) {
		console.log(box);
		setBoxCursor(box, "open");
		box.onmousedown = function(event) {
			//mouseDown();

			setBoxCursor(box, "closed");
			event.preventDefault();
			
			var boxX = parseInt(box.style.left);
			var boxY = parseInt(box.style.top);
			var mouseX = event.clientX;
			var mouseY = event.clientY;
			document.onmousemove = function(event) {
				event.preventDefault();
				setBoxCursor(box, "closed");
				box.style.left = boxX + event.clientX - mouseX + "px";
				box.style.top = boxY + event.clientY - mouseY + "px";
			}
			document.onmouseup = function(event) {
				event.preventDefault();
				box.style.left = "0px";
				box.style.top = "0px";
				console.log(box.style.top)
				document.onmousemove = null;
				setBoxCursor(box, "open")
			};
		};
	}

	


//******************************************
//*****************VIEW*********************
//******************************************
	function initView() {
		//importImages();
		makeStandardBoxes();
		updateBoxes(startFrame);
		window.onclick = ()=>launchFullScreen(getById("window"));
	}

//STANDARD BOXES
	function makeStandardBoxes() {
		makeStandardBox(boxes.standard.left);
		makeStandardBox(boxes.standard.right);
		makeStandardBox(boxes.standard.forward);
		makeStandardBox(boxes.standard.back);
	} 
	function makeStandardBox(boxData) {
		var box = makeBox(boxData);
		getById("standardBoxes").appendChild(box);
	}
	function updateStandardBoxes(frame) {
		updateStandardBox(boxes.standard.left, frames[frame].left);
		updateStandardBox(boxes.standard.right, frames[frame].right);
		updateStandardBox(boxes.standard.forward, frames[frame].forward);
		updateStandardBox(boxes.standard.back, frames[frame].back);
	}
	function updateStandardBox(boxData, destinationFrame) {
		var element = boxData.element;
		if (destinationFrame == null) {
			element.style.visibility = "hidden";
		} else {
			element.style.visibility = "visible";
			element.onclick = ()=>{transition(simpleEval(destinationFrame), boxData.transition);};
		}
	}

//CUSTOM BOXES
	//returns a box element from a JSON object containing box info, or null if the box shouldn't exist
	function makeCustomBox(boxData) {
		if (boxData.condition == null || boxData.condition()) {
			var box = makeBox(boxData);
			if (boxData.img != null) {											//pic boxes
				var pic = document.createElement("img");
				pic.classList.add("picBox");
				pic.src = BOX_PATH + simpleEval(boxData.img) + ".jpg";
				getById("picBoxes").appendChild(pic);
			}
			if(boxData.addListeners != null) {
				boxData.addListeners(box);
			}
			getById("boxes").appendChild(box);
		}
	}
	function clearCustomBoxes() {
		var boxesData = boxes.custom[frame];
		if (boxesData != null) {
			for (var i = 0; i < boxesData.length; i++) {
				if (boxesData[i].element != null) {
					boxesData[i].element.remove();
				}
			}
		}
	}

//INVENTORY BOXES
	function makeInventoryBox(boxData){
		var box = document.createElement("div");
		box.
		getById("inventory").add(box);
	}

//GENERIC BOXES
	function makeBox(boxData) {
		var box = document.createElement("div");
		box.className = "box";
		boxData.element = box;
		setBoxPos(box, boxData.pos);
		setBoxCursor(box, boxData.cursor);
		return box;
	}
	function setBoxPos(box, pos) {
		if (pos != null) {
			box.style.left = pos[0] * WIDTH + "px";
			box.style.width = (pos[1] - pos[0]) * WIDTH + "px";
			box.style.top = pos[3] * HEIGHT + "px";
			box.style.height = (pos[3] - pos[2]) * HEIGHT + "px";
			
		}
	}

	function setBoxCursor(box, cursor){
		box.style.cursor = "url("+ OTHER_PATH + cursor + ".png), auto";
	}
	
//TRANSITIONS
	//make a controller function for this?
	function transition(newFrame, type) {
		if (processes == 0) {
			processes++;
			var img = getById("img");
			var transitions = getById("transitions");
			updateBoxes(newFrame);
			if (type === "none") {
				img.src = FRAME_PATH + frame + ".jpg";
				processes--;
			} else {
				createTransition(type+"Out", 0);
				img.src = FRAME_PATH + frame + ".jpg"
				var x = 0;
				if (type === "left") {
					x = -WIDTH;
				} else if (type === "right") {
					x = WIDTH;
				}
				createTransition(type+"In", x); 
				img.style.visibility = "hidden";
				setTimeout(()=>{
					img.style.visibility = "visible";
				}, 100);

				if (type === "left" || type == "right") {
					setTimeout(()=>{
						transitions.innerHTML = "";
						processes--;
					}, SIDE_SPEED);
				} else {
					setTimeout(()=>{
						transitions.innerHTML = "";
						processes--;
					}, FADE_SPEED);
				}
			}
		}
	}
	function createTransition(type, x) {
		var transition = document.createElement("div");
		var img = document.createElement("img");
		var picBoxes = document.createElement("div");
		img.src = getById("img").src;
		img.classList.add("frame");
		picBoxes.innerHTML = getById("picBoxes").innerHTML;
		transition.appendChild(img);
		transition.appendChild(picBoxes);
		transition.classList.add("transition");
		transition.style.left = x +"px";
		transition.classList.add(type);
		getById("transitions").appendChild(transition);
	}

//OTHER
	//Plays the gif of the given name.  Takes the number of frames and the delay to calculate the time... (maybe make this automatic somehow?)
	function playGif(name, frames, delay) {
		/*processes++;	
		var gif = getById("fullGif");
		gif.src = GIF_PATH + name + ".gif" + "?a="+Math.random();
		gif.style.visibility = "visible"
		getById("movies").appendChild(gif);
		setTimeout(function() {
			gif.style.visibility = "hidden";
			processes--;
		}, frames*delay);	*/
	}

	function playSound(name, volume, loop) {
		//var sound = new Audio(AUDIO_PATH + name + ".mp3");	
		//sound.volume = 0;
		//sound.play();
		//return sound;
	}

	//launches full screen mode on the given element.
	function launchFullScreen(element) {
		if(element.requestFullScreen) {
		   element.requestFullScreen();
		} else if(element.mozRequestFullScreen) {
		   element.mozRequestFullScreen();
		} else if(element.webkitRequestFullScreen) {
		   element.webkitRequestFullScreen();
		}
	}

	function importImages() {
		for (var i = 0; i < 27; i++) {
			var preload = new Image();
			//preload.src = FRAME_PATH + i + ".png";
			getById("preloads").appendChild(preload);
		}
	}




//******************************************
//*****************HELPER*******************
//******************************************
	
	//returns the element with the given id
	function getById(id) {
		return document.getElementById(id);
	}

	//If x is a function, returns result of evaluating it, otherwise returns x
	function simpleEval(x) {
		if (x instanceof Function) {
			return (x)();
		} else {
			return x;
		}
	}

	function isCollide(a, b) {
    	return !(
     		((a.y + a.height) < (b.y)) ||
      	(a.y > (b.y + b.height)) ||
      	((a.x + a.width) < b.x) ||
      	(a.x > (b.x + b.width))
    	);
}

})();