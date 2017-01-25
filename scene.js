var mvMatrix = mat4.create();
var pMatrix = mat4.create();

/* Configuration du jeu éditable */
var SIZE = 7;                  // [3 à n] taille de la grille 3D
var FOV = 90;                  // angle de vue en degrés
var SHADOW_FACTOR = 0.6;       // [0 à 1] présence de l'effet d'ombrage
var PALIER = 5;                // [1 à n] nombre de bonus à prendre pour passer le niveau
var LEVEL_TIME = 30;           // temps maximum pour obtenir un bonus de niveau (en secondes)
var INITIAL_DELTA_T = 500;     // [100 à 1000] delta t entre les mouvements du serpent (en millisecondes)
var ACCELERATION_FACTOR = 0.2; // [0 à 1] accélération du serpent entre deux niveaux
var SNAKE_SIZE = 2;            // [2 à n] taille initiale du serpent

var sceneObjects = [];
var serpent;
var paused = false, gameover = false, muted = false;
var pauseMenu = document.getElementById("pause-menu");
var gameOverMenu = document.getElementById("gameover-menu");

initCanvas();
initWebGL();

window.onkeydown = handleKeyPressed;

function handleKeyPressed(ev){
    if (gameOverMenu.style.display == "block" && ev.keyCode == 32) {
        gameOverMenu.style.display = "none";
        gameover=false;
        initScene();
        console.log("reinit");
        return;
    }
    switch(ev.keyCode){
        case 87: //w -> back
            serpent.direction = [0, 0, -1];
            break;
        case 65: //a
        case 37: //left
            serpent.direction = [-1, 0, 0];
            break;
        case 83: //s -> front
            serpent.direction = [0, 0, 1];
            break;
        case 68: //d
        case 39: //right
            serpent.direction = [1, 0, 0];
            break;
        case 38: //up
            serpent.direction = [0, 1, 0];
            break;
        case 40: //down
            serpent.direction = [0, -1, 0];
            break;
        case 32: //spacebar
            togglePause(); break;
        default: break;
    }
    //console.log(ev.keyCode);
}


function togglePause(){
    paused = !paused;
    serpent.pause(paused);
    if(paused) var dis = "block";
    else var dis = "none";
    pauseMenu.style.display = dis;
}


myScroll = new IScroll('#canvas-container', {
    tap:true
});

myScroll.on('scrollEnd', function(){
    if(this.distY > 50) {
        // scroll bas
        serpent.direction = [0, 0, 1];
    }else if (this.distY < -50){
        // scroll haut
        serpent.direction = [0, 0, -1];
    }
});

document.getElementById("canvas-container").addEventListener('click', function(e){
    var w = parseInt(this.style.width);
    var h = parseInt(this.style.width);
    var left = e.offsetX;
    var top = e.offsetY;
    var right = w-left;
    var bottom = h-top;
    var choices = [
        {dist: left, direction: [-1, 0, 0]},
        {dist: top, direction: [0, 1, 0]},
        {dist: bottom, direction: [0, -1, 0]},
        {dist: right, direction: [1, 0, 0]}
    ];
    var min = choices[0];
    choices.forEach(function(choice){
        if(choice.dist < min.dist)
            min = choice
    });
    serpent.direction = min.direction;
}, false);


function initShaderParameters(prg){
	prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
	glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
	prg.colorAttribute 			= glContext.getAttribLocation(prg, "aColor");
	glContext.enableVertexAttribArray(prg.colorAttribute);
	prg.pMatrixUniform          = glContext.getUniformLocation(prg, 'uPMatrix');
	prg.mvMatrixUniform         = glContext.getUniformLocation(prg, 'uMVMatrix');

    prg.uSize = glContext.getUniformLocation(prg, "uSize");
    prg.uShadow = glContext.getUniformLocation(prg, "uShadow");

    glContext.uniform1f(prg.uSize, SIZE);
    glContext.uniform1f(prg.uShadow, SHADOW_FACTOR);
}

function initScene(){
    sceneObjects = [];

	mat4.identity(mvMatrix);

    var alpha = FOV/2 * Math.PI/180;
    var z = SIZE + SIZE/(2*Math.tan(alpha));

    mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(-SIZE / 2, -SIZE / 2, -z));

    mat4.identity(pMatrix);
    mat4.perspective(pMatrix, degToRad(FOV), c_width / c_height, 0.1, z+1);

    glContext.enable(glContext.DEPTH_TEST);
	
	sceneObjects.push(new Grid(SIZE));

    serpent = new Snake([-1,0,0],SNAKE_SIZE);
	sceneObjects.push(serpent);

    glContext.clearColor(0.0, 0.0, 0.0, 0.0);
  
}

function drawScene(){
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
	glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
	sceneObjects.forEach(function(o){
		o.draw();
	});
}

function initWebGL(){
	glContext = getGLContext('webgl-canvas');
	initProgram();
	initScene();
	renderLoop();
}

function initCanvas() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    a = Math.min(w, h) * 0.7;
    var canvas = document.getElementById("webgl-canvas");
    var bonus = document.getElementById("bonus");
    canvas.width = canvas.height = a;
    var cc = document.getElementById("canvas-container");
    bonus.style.width = cc.style.width = cc.style.height = a + 'px';
    bonus.style.top = (a / 2 - 20) + 'px';
    var menu = document.getElementById("game-menu");
    menu.style.left = menu.style.top = a / 4 + 'px';
    var container = document.getElementById("container");
    container.style.maxWidth = (100 + a) + 'px';
}

function toggleHelp() {
    help = document.getElementById("help");
    if (help.style.display == "block") {
        help.style.display = "none";
    } else {
        help.style.display = "block";
        if (!paused)
            togglePause();
    }
}

function toggleMute(btn_mute) {
    if (muted) {
        btn_mute.style.color = "red";
    } else {
        btn_mute.style.color = "blue";
    }
    muted = !muted;
}

document.getElementById("music").volume = 0.8;
function toggleMusic(btn_music){
    var audio = document.getElementById("music");
    if (audio.volume == 0){
        audio.volume = 0.8;
        btn_music.style.color = "red";
    }else{
        audio.volume = 0;
        btn_music.style.color = "blue";
    }
}


function playSound(id) {
    if (muted)return;
    var audio = document.getElementById(id);
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}
