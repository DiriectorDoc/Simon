window.onload = function(){

    //~~~~~~~~~~~~~~~~~~~~~
    //~~~~VARIABLE LIST~~~~
    //~~~~~~~~~~~~~~~~~~~~~

    let green   = 0,
        red     = 1,
        yellow  = 2,
        blue    = 3;
    /*
    ** green  : Num; Makes code easier to understand when reading.
    ** red    : Num; Makes code easier to understand when reading.
    ** yellow : Num; Makes code easier to understand when reading.
    ** blue   : Num; Makes code easier to understand when reading.
    */

    var canvas = document.getElementById("canvas"),
        c      = canvas.getContext("2d");
    /*
    ** canvas : Element; Used for event listeners and to get context.
    ** c      : Context; Used to draw on the canvas.
    */

    let threeOClock     = 0,
        nineOClock      = 3.141592653589793238462643383279502884197169399375105820974944592307816406286,
        sixOClock       = nineOClock/2,
        twelveOClock    = sixOClock+nineOClock,
        center          = 250;
    /*
    ** threeOClock  : Num; Makes code easier to understand when reading.
    ** nineOClock   : Num; Makes code easier to understand when reading.
    ** sixOClock    : Num; Makes code easier to understand when reading.
    ** twelveOClock : Num; Makes code easier to understand when reading.
    ** center       : Num; Makes code easier to understand when reading.
    */

    let tau = 3.141592653589793238462643383279502884197169399375105820974944592307816406286*2;
    /*
    ** tau : Num; Makes code easier to understand when reading.
    */

    var A4 = document.createElement("audio"),
        E5 = document.createElement("audio"),
        A5 = document.createElement("audio"),
        C5 = document.createElement("audio"),
        Buzz = document.createElement("audio");
        A4.src = "440.wav";
        E5.src = "659.25.wav";
        A5.src = "880.wav";
        C5.src = "523.25.wav";
        Buzz.src = "150.wav";
    console.time("Time to load all sound files");
        A4.name = "Note: %cA4";
        E5.name = "Note: %cE5";
        A5.name = "Note: %cA5";
        C5.name = "Note: %cC5";
        Buzz.name = "Sound: %cBuzz";
    var notes = [A5, E5, C5, A4];
    /*
    ** A4    : Audio; played when needed.
    ** E5    : Audio; played when needed.
    ** A5    : Audio; played when needed.
    ** C5    : Audio; played when needed.
    ** Buzz  : Audio; played when needed.
    ** notes : Array; Organized Audios.
    */

    var patern = new Array(),
        input  = new Array();
    /*
    ** patern : Array; Stores the randomly generated patern.
    ** input  : Array; Stores the user input.
    */

    var quadrant = 0;
    /*
    ** quadrant : Num; Stores mouse co-ordinate reletive to center.
    */

    var radX,
        radY;
    /*
    ** radX : Num; Stores distance of mouce to center.
    ** radY : Num; Stores distance of mouce to center.
    */

    var pressable = true,
        iterating = false;
    /*
    ** pressable : Bool; Used to allow and forbit user to cause an event after clicking. (both used in the same listner, basicaly a double-checker)
    ** iterating : Bool; Used to allow and forbit user to cause an event after clicking. (both used in the same listner, basicaly a double-checker)
    */

    var position = 0;
    /*
    ** position : Num; Stores that patern position when retriving user input.
    */

    var buttonOffFill = ["#00ff00", "#ff0000", "#ffff00", "#0000ff"],
        buttonLitFill = new Array();
    (function(pos1, pos2){
        for(var i = 0; i < 4; i++){
            buttonLitFill[i] = c.createRadialGradient(pos1[i], pos2[i], 15, pos1[i], pos2[i], 125)
            buttonLitFill[i].addColorStop(0, "#ffff88");
            buttonLitFill[i].addColorStop(1, buttonOffFill[i]);
        }
    })([
           center/2 + 15,
           (center + center/2) - 15,
           center/2 + 15,
           (center + center/2) - 15
       ],
       [
           center/2 + 15,
           center/2 + 15,
           (center + center/2) - 15,
           (center + center/2) - 15
       ]);
    /*
    ** buttonOffFill : Array; stores fill colour of canvas buttons.
    ** buttonLitFill : Array; stores gradient fill colours of canvas buttons.
    */


    //~~~~~~~~~~~~~~~~~~~~~
    //~~~~FUNCTION LIST~~~~
    //~~~~~~~~~~~~~~~~~~~~~

    function randomOf(){
        return arguments[Math.floor(Math.random() * arguments.length)];
    }
    /*
    ** randomOf : Function; Returns one of the provided arguments at random.
    */

    function createGame(){
        var gradient = c.createRadialGradient(center, center, 20, center, center, 300);
            gradient.addColorStop(0, "#888888");
            gradient.addColorStop(1, "#000000");

        c.fillStyle     = gradient;
        c.strokeStyle   = "#0000ff";
        c.beginPath();
        c.arc(center, center, 250, 0, tau, true);

        c.fill();
        c.stroke();
    }
    /*
    ** createGame : Function; Draws the game "machine".
    */

    function createButton(pos1, pos2, angle1, angle2, fill, stroke){
        c.fillStyle     = fill;
        c.strokeStyle   = stroke;
        c.beginPath();
        c.arc(pos1, pos2, 200, angle1, angle2, false);
        c.arc(pos1, pos2, 95, angle2, angle1, true);
        c.closePath();

        c.fill();
        c.stroke();
    }
    /*
    ** createButton : Function(pos1 : Num, pos2 : Num, angle1 : Num, angle2 : Num, fill : fill value, stroke : colour); Draws the game buttons.
    */

    function pythag(width, height){
        return Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    }
    /*
    ** pythag : Function(width : Num, height : Num); Used for determining the distance from the mouce to the center.
    **                                               Uses principals of pythatorian therium: a² + b² = c²
    **
    **                                                 ʌ  2     |     |‾‾) 2  ____  ┌─── 2
    **                                                /_\    ---|---  |==           │
    **                                               /   \      |     |__)    ‾‾‾‾  └───
    **
    **                                                                 0
    **                                                                0 0
    **                                                               _______________________
    **                                               ┌───  ____    /  ʌ  2     |     |‾‾) 2
    **                                               │            /  /_\    ---|---  |==
    **                                               └───  ‾‾‾‾ \/  /   \      |     |__)
    */

    function iterate(x){
        var i = 0;
        iterating = true;
        function a(){
            setTimeout(function(){
                notes[patern[i]].play();
                switch(patern[i]){
                    case green:
                        createButton(center-5, center-5, nineOClock, twelveOClock, buttonLitFill[green], "#007700");
                        break;
                    case red:
                        createButton(center+5, center-5, twelveOClock, threeOClock, buttonLitFill[red], "#770000");
                        break;
                    case yellow:
                        createButton(center-5, center+5, sixOClock, nineOClock, buttonLitFill[yellow], "#777700");
                        break;
                    case blue:
                        createButton(center+5, center+5, threeOClock, sixOClock, buttonLitFill[blue], "#000077");
                        break;
                }
                i++
                if(i < x){
                    a();
                } else {
                    iterating = false;
                }
                setTimeout(function(){
                    createButton(center-5, center-5, nineOClock, twelveOClock, buttonOffFill[green], "#007700");
                    createButton(center+5, center-5, twelveOClock, threeOClock, buttonOffFill[red], "#770000");
                    createButton(center-5, center+5, sixOClock, nineOClock, buttonOffFill[yellow], "#777700");
                    createButton(center+5, center+5, threeOClock, sixOClock, buttonOffFill[blue], "#000077");
                }, 400);
            }, 650);
        }
        a();
    }
    /*
    ** iterate : Function(x : Num); Repeats x number of times with a delay.
    ** a       : Function;          Plays sound and "turn on and off" the lights.
    */
    
    function sequence(){
        position++;
        if(position == patern.length){
            pressable = false;
            position = 0;
            setTimeout(function(){
                patern.push(randomOf(green, red, yellow, blue));
                console.info("Added " + (
                    (patern[patern.length - 1] == 0) ? "Green":((patern[patern.length - 1] == 1) ? "Red":((patern[patern.length - 1] == 2) ? "Yellow":"Blue"))
                ) + " to %cpatern", "font-style: italic;")
                iterate(patern.length);
                setTimeout(function(){
                    pressable = true;
                }, 650 * (patern.length + 1));
            }, 400);
        }
    }
    /*
    ** sequence : Function; Adds on to the patern when and if player completes the patern.
    */
    
    function logPatern(message){
        console.groupCollapsed(message);
        for(var i = 0; i < 4; i++){
            console.log("Position " + (i + 1) + ": " + ((patern[i] == 0) ? "Green":((patern[i] == 1) ? "Red":((patern[i] == 2) ? "Yellow":"Blue"))));
        }
        console.groupEnd();
    }
    /*
    ** logPatern : Function; Outputs the patern to the console in an orginazed fasion.
    */


    //~~~~~~~~~~~~~~~~~~~~~
    //~~~~LISTENER LIST~~~~
    //~~~~~~~~~~~~~~~~~~~~~

    canvas.onmousemove = function(e){
        radX = e.clientX - canvas.getBoundingClientRect().left;
        radY = e.clientY - canvas.getBoundingClientRect().top;

        quadrant = 0;
        if(e.clientY - canvas.getBoundingClientRect().top > 250)    quadrant += 2;
        if(e.clientX - canvas.getBoundingClientRect().left > 250)   quadrant += 1;
    }
    /*
    ** canvas.onmousemove : Listener; Sets variables:
    **                                    radX
    **                                    radY
    **                                    quadrant
    **                                Updated variables every time the mouse moves on the canvas.
    */

    canvas.addEventListener("click", function(){
        if(!iterating){
            switch(quadrant){
                case green:
                    if(pythag(245 - radX , 245 - radY) > 95 &&
                       pythag(245 - radX , 245 - radY) < 200){
                        if(pressable){
                            if(quadrant == patern[position]){
                                notes[quadrant].play();
                                createButton(center-5, center-5, nineOClock, twelveOClock, buttonLitFill[green], "#007700");
                                pressable = false;
                                setTimeout(function(){
                                    createButton(center-5, center-5, nineOClock, twelveOClock, buttonOffFill[green], "#007700");
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
                    if(pythag(255 - radX , 245 - radY) > 95 &&
                       pythag(255 - radX , 245 - radY) < 200){
                        if(pressable){
                            if(quadrant == patern[position]){
                                notes[quadrant].play();
                                createButton(center+5, center-5, twelveOClock, threeOClock, buttonLitFill[red], "#770000");
                                pressable = false;
                                setTimeout(function(){
                                    createButton(center+5, center-5, twelveOClock, threeOClock, buttonOffFill[red], "#770000");
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
                    if(pythag(245 - radX , 255 - radY) > 95 &&
                       pythag(245 - radX , 255 - radY) < 200){
                        if(pressable){
                            if(quadrant == patern[position]){
                                notes[quadrant].play();
                                createButton(center-5, center+5, sixOClock, nineOClock, buttonLitFill[yellow], "#777700");
                                pressable = false;
                                setTimeout(function(){
                                    createButton(center-5, center+5, sixOClock, nineOClock, buttonOffFill[yellow], "#777700");
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
                    if(pythag(255 - radX , 255 - radY) > 95 &&
                       pythag(255 - radX , 255 - radY) < 200){
                        if(pressable){
                            if(quadrant == patern[position]){
                                notes[quadrant].play();
                                createButton(center+5, center+5, threeOClock, sixOClock, buttonLitFill[blue], "#000077");
                                pressable = false;
                                setTimeout(function(){
                                    createButton(center+5, center+5, threeOClock, sixOClock, buttonOffFill[blue], "#000077");
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
    /*
    ** canvas.addEventListener("click") : Listener; Uses quadrant, mouse position, and booleans to produce a specific game output upon every click.
    */

    function canBePlayed1(){
        A4.isLoaded = true;
        console.info(A4.name + "%c is now loaded completely.", "font-style: italic;", ""); 
        A4.removeEventListener("canplaythrough", canBePlayed1);
        if(
            true == A4.isLoaded &&
            true == E5.isLoaded &&
            true == A5.isLoaded &&
            true == C5.isLoaded &&
            true == Buzz.isLoaded
        ){
            console.info("All sound files are now loaded completely.");
            console.timeEnd("Time to load all sound files");
        }
        delete canBePlayed1;
    }
    function canBePlayed2(){
        E5.isLoaded = true;
        console.info(E5.name + "%c is now loaded completely.", "font-style: italic;", "");
        E5.removeEventListener("canplaythrough", canBePlayed2);
        delete canBePlayed2;
        if(
            true == A4.isLoaded &&
            true == E5.isLoaded &&
            true == A5.isLoaded &&
            true == C5.isLoaded &&
            true == Buzz.isLoaded
        ){
            console.info("All sound files are now loaded completely.");
            console.timeEnd("Time to load all sound files");
        }
    }
    function canBePlayed3(){
        A5.isLoaded = true;
        console.info(A5.name + "%c is now loaded completely.", "font-style: italic;", "");
        A5.removeEventListener("canplaythrough", canBePlayed3);
        delete canBePlayed3;
        if(
            true == A4.isLoaded &&
            true == E5.isLoaded &&
            true == A5.isLoaded &&
            true == C5.isLoaded &&
            true == Buzz.isLoaded
        ){
            console.info("All sound files are now loaded completely.");
            console.timeEnd("Time to load all sound files");
        }
    }
    function canBePlayed4(){
        C5.isLoaded = true;
        console.info(C5.name + "%c is now loaded completely.", "font-style: italic;", "");
        C5.removeEventListener("canplaythrough", canBePlayed4);
        delete canBePlayed4;
        if(
            true == A4.isLoaded &&
            true == E5.isLoaded &&
            true == A5.isLoaded &&
            true == C5.isLoaded &&
            true == Buzz.isLoaded
        ){
            console.info("All sound files are now loaded completely.");
            console.timeEnd("Time to load all sound files");
        }
    }
    function canBePlayed5(){
        Buzz.isLoaded = true;
        console.info(Buzz.name + "%c is now loaded completely.", "font-style: italic;", "");
        Buzz.removeEventListener("canplaythrough", canBePlayed5);
        delete canBePlayed5;
        if(
            true == A4.isLoaded &&
            true == E5.isLoaded &&
            true == A5.isLoaded &&
            true == C5.isLoaded &&
            true == Buzz.isLoaded
        ){
            console.info("All sound files are now loaded completely.");
            console.timeEnd("Time to load all sound files");
        }
    }
    A4.addEventListener("canplaythrough", canBePlayed1, false);
    E5.addEventListener("canplaythrough", canBePlayed2, false);
    A5.addEventListener("canplaythrough", canBePlayed3, false);
    C5.addEventListener("canplaythrough", canBePlayed4, false);
    Buzz.addEventListener("canplaythrough", canBePlayed5, false);
    /*
    ** A4.addEventListener("canplaythrough")   : Listener; Used for debugging. Ouputs to console when the sound file is completely loaded.
    ** E5.addEventListener("canplaythrough")   : Listener; Used for debugging. Ouputs to console when the sound file is completely loaded.
    ** A5.addEventListener("canplaythrough")   : Listener; Used for debugging. Ouputs to console when the sound file is completely loaded.
    ** C5.addEventListener("canplaythrough")   : Listener; Used for debugging. Ouputs to console when the sound file is completely loaded.
    ** Buzz.addEventListener("canplaythrough") : Listener; Used for debugging. Ouputs to console when the sound file is completely loaded.
    */


    for(var i = 0; i < 4; i++){
        patern.push(randomOf(green, red, yellow, blue));
    }
    logPatern("Patern Created");
    (function(array){
        for(var i = 0; i < array.length; i++){
            if(!array.isLoaded){
                console.warn(array[i].name + "%c is not fully loaded yet. Sound may not play.", "font-style: italic;", "");
            }
        }
    })([A4, E5, A5, C5, Buzz])
    createGame();
    createButton(center-5, center-5, nineOClock, twelveOClock, buttonOffFill[green], "#007700"); //These lined up perfectly, I just thought I'd point it out
    createButton(center+5, center-5, twelveOClock, threeOClock, buttonOffFill[red], "#770000");  //These lined up perfectly, I just thought I'd point it out
    createButton(center-5, center+5, sixOClock, nineOClock, buttonOffFill[yellow], "#777700");   //These lined up perfectly, I just thought I'd point it out
    createButton(center+5, center+5, threeOClock, sixOClock, buttonOffFill[blue], "#000077");    //These lined up perfectly, I just thought I'd point it out
    pressable = false;
    iterate(patern.length);
    setTimeout(function(){
        pressable = true;
    }, 650 * (patern.length + 1));
}