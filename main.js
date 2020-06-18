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
    
	const PI			= 3.141592653589793,
		  HALF_PI		= PI/2,
		  HALF_THREE_PI	= HALF_PI+PI,
		  TAU			= PI*2,
		  CENTRE		= 250;

    /* Audio files */
    let A4 = document.createElement("audio"),
		E5 = document.createElement("audio"),
		A5 = document.createElement("audio"),
		C5 = document.createElement("audio"),
		Buzz = document.createElement("audio");
	A4.src = "440.wav";
    E5.src = "659.25.wav";
    A5.src = "880.wav";
    C5.src = "523.25.wav";
    Buzz.src = "150.wav";
    console.time("Time to load sound files");
    const notes = [A5, E5, C5, A4];
	/*
	**	A5 -> green
	**	E5 -> red
	**	C5 -> yellow
	**	A4 -> blue
	***/

	let pattern = new Array(),	//Stores randomly generated pattern
		quadrant,				//Value from 0⁠ – 3
		radX,					//Mouse's X coord's distance from centre
		radY,                   //Mouse's Y coord's distance from centre
		pressable = true,		//Controls when the player can and can't press the buttons
		iterating = false,		//Lets program know when 
		position = 0			//Haw far into the sequence the player has played;

    let buttonOffFill = ["#00ff00", "#ff0000", "#ffff00", "#0000ff"],
        buttonLitFill = new Array();
    (function(pos1, pos2){
        for(var i = 0; i < 4; i++){
            buttonLitFill[i] = c.createRadialGradient(pos1[i], pos2[i], 15, pos1[i], pos2[i], 125)
            buttonLitFill[i].addColorStop(0, "#ffff88");
            buttonLitFill[i].addColorStop(1, buttonOffFill[i]);
        }
    })([140, 360, 140, 360], [140, 140, 360, 360])
	/* 
	*	140 = CENTRE/2 + 15
	*	360 = (CENTRE + CENTRE/2) - 15
	*/


	function pickRandom(){
        return arguments[Math.floor(Math.random() * arguments.length)];
    }
	
	function createButton(pos1, pos2, angle1, angle2, fill, stroke){
        c.fillStyle = fill;
        c.strokeStyle = stroke;
        c.beginPath();
        c.arc(pos1, pos2, 200, angle1, angle2, false);
        c.arc(pos1, pos2, 95, angle2, angle1, true);
        c.closePath();

        c.fill();
        c.stroke();
    }

    function createGame(){
        let gradient = c.createRadialGradient(CENTRE, CENTRE, 20, CENTRE, CENTRE, 300);
            gradient.addColorStop(0, "#888888");
            gradient.addColorStop(1, "#000000");

        c.fillStyle = gradient;
        c.strokeStyle = "#0000ff";
        c.beginPath();
        c.arc(CENTRE, CENTRE, 250, 0, TAU, true);

        c.fill();
        c.stroke();
		
		createButton(CENTRE-5, CENTRE-5, PI, HALF_THREE_PI, buttonOffFill[green], "#007700");
		createButton(CENTRE+5, CENTRE-5, HALF_THREE_PI, 0, buttonOffFill[red], "#770000");
		createButton(CENTRE-5, CENTRE+5, HALF_PI, PI, buttonOffFill[yellow], "#777700");
		createButton(CENTRE+5, CENTRE+5, 0, HALF_PI, buttonOffFill[blue], "#000077");
    }

    function iterate(x){
        var i = 0;
        iterating = true;
        function a(){
            setTimeout(function(){
                notes[pattern[i]].play();
                switch(pattern[i]){
                    case green:
                        createButton(CENTRE-5, CENTRE-5, PI, HALF_THREE_PI, buttonLitFill[green], "#007700");
                        break;
                    case red:
                        createButton(CENTRE+5, CENTRE-5, HALF_THREE_PI, 0, buttonLitFill[red], "#770000");
                        break;
                    case yellow:
                        createButton(CENTRE-5, CENTRE+5, HALF_PI, PI, buttonLitFill[yellow], "#777700");
                        break;
                    case blue:
                        createButton(CENTRE+5, CENTRE+5, 0, HALF_PI, buttonLitFill[blue], "#000077");
                        break;
                }
                i++
                if(i < x){
                    a();
                } else {
                    iterating = false;
                }
                setTimeout(function(){
                    createButton(CENTRE-5, CENTRE-5, PI, HALF_THREE_PI, buttonOffFill[green], "#007700");
                    createButton(CENTRE+5, CENTRE-5, HALF_THREE_PI, 0, buttonOffFill[red], "#770000");
                    createButton(CENTRE-5, CENTRE+5, HALF_PI, PI, buttonOffFill[yellow], "#777700");
                    createButton(CENTRE+5, CENTRE+5, 0, HALF_PI, buttonOffFill[blue], "#000077");
                }, 400);
            }, 650);
        }
        a();
    }
    
    function sequence(){
        position++;
        if(position == pattern.length){
            pressable = false;
            position = 0;
            setTimeout(function(){
                pattern.push(pickRandom(green, red, yellow, blue));
                console.info("Added " + (
                    (pattern[pattern.length - 1] == 0) ? "Green":((pattern[pattern.length - 1] == 1) ? "Red":((pattern[pattern.length - 1] == 2) ? "Yellow":"Blue"))
                ) + " to %cpattern", "font-style: italic;")
                iterate(pattern.length);
                setTimeout(function(){
                    pressable = true;
                }, 650 * (pattern.length + 1));
            }, 400);
        }
    }
    /*
    ** sequence : Function; Adds on to the pattern when and if player completes the pattern.
    */
    
    function logPattern(message){
        console.groupCollapsed(message);
        for(var i = 0; i < 4; i++){
            console.log("Position " + (i + 1) + ": " + ((pattern[i] == 0) ? "Green":((pattern[i] == 1) ? "Red":((pattern[i] == 2) ? "Yellow":"Blue"))));
        }
        console.groupEnd();
    }


	canvas.onmousemove = function(e){
		radX = e.clientX - canvas.getBoundingClientRect().left;
		radY = e.clientY - canvas.getBoundingClientRect().top;
		
		quadrant = 0;
		quadrant += radX > 250 ? 1:0;
		quadrant += radY > 250 ? 2:0;
    }
	
	canvas.addEventListener("click", function(){
        if(!iterating){
            switch(quadrant){
                case green:
                    if(Math.hypot(245 - radX , 245 - radY) > 95 &&
                       Math.hypot(245 - radX , 245 - radY) < 200){
                        if(pressable){
                            if(quadrant == pattern[position]){
                                notes[quadrant].play();
                                createButton(CENTRE-5, CENTRE-5, PI, HALF_THREE_PI, buttonLitFill[green], "#007700");
                                pressable = false;
                                setTimeout(function(){
                                    createButton(CENTRE-5, CENTRE-5, PI, HALF_THREE_PI, buttonOffFill[green], "#007700");
                                    setTimeout(function(){
                                        pressable = true
                                    }, 175);
                                }, 400);
                            } else {
                                Buzz.play();
                                pressable = false;
                            }
                            sequence();
                        }
                    }
                    break;
                case red:
                    if(Math.hypot(255 - radX , 245 - radY) > 95 &&
                       Math.hypot(255 - radX , 245 - radY) < 200){
                        if(pressable){
                            if(quadrant == pattern[position]){
                                notes[quadrant].play();
                                createButton(CENTRE+5, CENTRE-5, HALF_THREE_PI, 0, buttonLitFill[red], "#770000");
                                pressable = false;
                                setTimeout(function(){
                                    createButton(CENTRE+5, CENTRE-5, HALF_THREE_PI, 0, buttonOffFill[red], "#770000");
                                    setTimeout(function(){
                                        pressable = true
                                    }, 175);
                                }, 400);
                            } else {
                                Buzz.play();
                                pressable = false;
                            }
                            sequence();
                        }
                    }
                    break;
                case yellow:
                    if(Math.hypot(245 - radX , 255 - radY) > 95 &&
                       Math.hypot(245 - radX , 255 - radY) < 200){
                        if(pressable){
                            if(quadrant == pattern[position]){
                                notes[quadrant].play();
                                createButton(CENTRE-5, CENTRE+5, HALF_PI, PI, buttonLitFill[yellow], "#777700");
                                pressable = false;
                                setTimeout(function(){
                                    createButton(CENTRE-5, CENTRE+5, HALF_PI, PI, buttonOffFill[yellow], "#777700");
                                    setTimeout(function(){
                                        pressable = true
                                    }, 175);
                                }, 400);
                            } else {
                                    Buzz.play();
                                pressable = false;
                            }
                            sequence();
                        }
                    }
                    break;
                case blue:
                    if(Math.hypot(255 - radX , 255 - radY) > 95 &&
                       Math.hypot(255 - radX , 255 - radY) < 200){
                        if(pressable){
                            if(quadrant == pattern[position]){
                                notes[quadrant].play();
                                createButton(CENTRE+5, CENTRE+5, 0, HALF_PI, buttonLitFill[blue], "#000077");
                                pressable = false;
                                setTimeout(function(){
                                    createButton(CENTRE+5, CENTRE+5, 0, HALF_PI, buttonOffFill[blue], "#000077");
                                    setTimeout(function(){
                                        pressable = true
                                    }, 175);
                                }, 400);
                            } else {
                                Buzz.play();
                                pressable = false;
                            }
                            sequence();
                        }
                    }
                    break;
                default:
                    console.warn("Somehow got input from quadrant " + quadrant);
                    break;
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
    createGame();
    pressable = false;
    iterate(pattern.length);
    setTimeout(function(){
        pressable = true;
    }, 650 * (pattern.length + 1));
}

if(!window){
    var console,document,window,setTimeout;
}