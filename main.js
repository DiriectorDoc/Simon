/*eslint-env es6*/
/*eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"]*/
window.onload = function(){

	/* Variables for readability */
	"use strict";
	const green		= 0,
		  red		= 1,
		  yellow	= 2,
		  blue		= 3;

	let canvas	= document.getElementById("canvas"),
		c		= canvas.getContext("2d");

	const PI			= Math.PI,
		  HALF_PI		= PI/2,
		  HALF_THREE_PI	= HALF_PI+PI,
		  TAU			= PI*2,
		  CENTRE		= 250;

	let A4 = document.createElement("audio"),	//A5 -> green
		E5 = document.createElement("audio"),	//E5 -> red
		A5 = document.createElement("audio"),	//C5 -> yellow
		C5 = document.createElement("audio"),	//A4 -> blue
		Buzz = document.createElement("audio");
	A4.src = "440.wav";
	E5.src = "659.25.wav";
	A5.src = "880.wav";
	C5.src = "523.25.wav";
	Buzz.src = "150.wav";
	console.time("Time to load sound files");
	

	let pattern = new Array(),	//Stores randomly generated pattern
		quadrant,				//Value from 0⁠ – 3
		distX,					//Mouse's X coord's distance from centre
		distY,					//Mouse's Y coord's distance from centre
		pressable = true,		//Controls when the player can and can't press the buttons
		position = 0;			//Haw far into the sequence the player has played

	let buttonColours = ["#00ff00", "#ff0000", "#ffff00", "#0000ff"],
		buttonGradients = new Array();
	(function(pos1, pos2){ //This creates the buttons' "on" state graphic. Used in an IIFE to save space
		for(var i = 0; i < 4; i++){
			buttonGradients[i] = c.createRadialGradient(pos1[i], pos2[i], 15, pos1[i], pos2[i], 125)
			buttonGradients[i].addColorStop(0, "#ffff88");
			buttonGradients[i].addColorStop(1, buttonColours[i]);
		}
	})([140, 360, 140, 360], [140, 140, 360, 360]) // 140 = CENTRE/2 + 15, 360 = (CENTRE + CENTRE/2) - 15
	
	function buttonObj(i, p1, p2, a1, a2, colour, note){ //This is what creates the brain of each button
		return {
			"on": function(){
				drawButton(p1, p2, a1, a2, buttonGradients[i], colour);
			},
			"off": function(){
				drawButton(p1, p2, a1, a2, buttonColours[i], colour);
			},
			"press": function(){
				note.play();
				Buttons[i].on();
				setTimeout(function(){
					Buttons[i].off();
				}, 400);
			}
		}
	}

	const Buttons = [ //This is where all the buttons' brains are kept; all neatly kept away in one place
		buttonObj(green, CENTRE-5, CENTRE-5, PI, HALF_THREE_PI, "#007700", A5),
		buttonObj(red, CENTRE+5, CENTRE-5, HALF_THREE_PI, 0, "#770000", E5),
		buttonObj(yellow, CENTRE-5, CENTRE+5, HALF_PI, PI, "#777700", C5),
		buttonObj(blue, CENTRE+5, CENTRE+5, 0, HALF_PI, "#000077", A4)
	];


	function pickRandom(){
		return arguments[Math.floor(Math.random() * arguments.length)];
	}

	function drawButton(pos1, pos2, angle1, angle2, fill, stroke){
		c.fillStyle = fill;
		c.strokeStyle = stroke;
		c.beginPath();
		c.arc(pos1, pos2, 200, angle1, angle2, false);
		c.arc(pos1, pos2, 95, angle2, angle1, true);
		c.closePath();

		c.fill();
		c.stroke();
	}

	function drawGame(){
		let gradient = c.createRadialGradient(CENTRE, CENTRE, 20, CENTRE, CENTRE, 300);
			gradient.addColorStop(0, "#888888");
			gradient.addColorStop(1, "#000000");

		c.fillStyle = gradient;
		c.strokeStyle = "#0000ff";
		c.beginPath();
		c.arc(CENTRE, CENTRE, 249, 0, TAU, true);

		c.fill();
		c.stroke();

		for(var i = 0; i < 4; i++)
			Buttons[i].off();
	}

	/* Plays the pattern. Each item in the pattern is played within 650ms of the next. Prevents user input while iterating */
	function iterate(){
		var i = 0;
		pressable = false;
		let iterator = setInterval(function(){
			Buttons[pattern[i]].press();
			if(++i >= pattern.length){
				pressable = true;
				clearInterval(iterator);
			}
		}, 650);
	}

	/*
	**	Checks how far along in the patter the player is. If the pattern was completed,
	**	this function will add to the pattern and iterate it with the new addition
	*/
	function sequence(){
		position++;
		if(position == pattern.length){
			pressable = false;
			position = 0;
			setTimeout(function(){
				pattern.push(pickRandom(green, red, yellow, blue));
				console.info("Added " + ["Green", "Red", "Yellow", "Blue"][pattern[pattern.length - 1]] + " to %cpattern", "font-style: italic;")
				iterate();
			}, 400);
		}
	}

	function logPattern(message){
		console.groupCollapsed(message);
		for(var i = 0; i < 4; i++){
			console.log("Position " + (i + 1) + ": " + ["Green", "Red", "Yellow", "Blue"][pattern[i]]);
		}
		console.groupEnd();
	}


	canvas.onmousemove = function(e){
		distX = e.clientX - canvas.getBoundingClientRect().left;
		distY = e.clientY - canvas.getBoundingClientRect().top;

		quadrant = 0;
		quadrant += distX > 250 ? 1:0;
		quadrant += distY > 250 ? 2:0;
	}

	canvas.addEventListener("click", function(){
		let radius;
		switch(quadrant){
			case green:
				radius = Math.hypot(245 - distX , 245 - distY);
				break;
			case red:
				radius = Math.hypot(255 - distX , 245 - distY);
				break;
			case yellow:
				radius = Math.hypot(245 - distX , 255 - distY);
				break;
			case blue:
				radius = Math.hypot(255 - distX , 255 - distY);
				break;
			default:
				console.warn("Somehow got input from quadrant " + quadrant + ". This quadrand does not exist.");
				return;
		}
		if(radius > 95 && radius < 200){
			if(pressable){
				if(quadrant == pattern[position]){
					pressable = false;
					Buttons[quadrant].press();
					setTimeout(function(){
						pressable = true
					}, 425);
				} else {
					Buzz.play();
					pressable = false;
				}
				sequence();
			}
		}
	}, false);

	function areAllFilesLoaded(){
		if(A4.isLoaded && E5.isLoaded && A5.isLoaded && C5.isLoaded && Buzz.isLoaded){
			console.info("All sound files loaded.");
			console.timeEnd("Time to load sound files");
		}
	}
	function canBePlayed1(){
		A4.isLoaded = true;
		A4.removeEventListener("canplaythrough", canBePlayed1);
		areAllFilesLoaded()
	}
	function canBePlayed2(){
		E5.isLoaded = true;
		E5.removeEventListener("canplaythrough", canBePlayed2);
		areAllFilesLoaded()
	}
	function canBePlayed3(){
		A5.isLoaded = true;
		A5.removeEventListener("canplaythrough", canBePlayed3);
		areAllFilesLoaded()
	}
	function canBePlayed4(){
		C5.isLoaded = true;
		C5.removeEventListener("canplaythrough", canBePlayed4);
		areAllFilesLoaded()
	}
	function canBePlayed5(){
		Buzz.isLoaded = true;
		Buzz.removeEventListener("canplaythrough", canBePlayed5);
		areAllFilesLoaded()
	}
	A4.addEventListener("canplaythrough", canBePlayed1, false);
	E5.addEventListener("canplaythrough", canBePlayed2, false);
	A5.addEventListener("canplaythrough", canBePlayed3, false);
	C5.addEventListener("canplaythrough", canBePlayed4, false);
	Buzz.addEventListener("canplaythrough", canBePlayed5, false);


	for(var i = 0; i < 4; i++){
		pattern.push(pickRandom(green, red, yellow, blue));
	}
	logPattern("Starting pattern");
	drawGame();
	pressable = false;
	iterate();
	setTimeout(function(){
		pressable = true;
	}, 650 * (pattern.length + 1));
}

/* This has no function other than suppressing IDE errors */
if(!window){
	var console,document,window,setTimeout,setInterval,clearInterval;
}